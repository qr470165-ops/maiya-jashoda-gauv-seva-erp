import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      accessToken,
      fullName,
      userId,
      password,
      role,
      modules,
    } = body;

    if (!accessToken || !fullName?.trim() || !userId?.trim() || !password?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Missing required information.' },
        { status: 400 }
      );
    }

    if (password.trim().length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { success: false, error: 'Server Supabase configuration is missing.' },
        { status: 500 }
      );
    }

    // Server-only Supabase Admin client.
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Verify that the person making the request is actually logged in.
    const {
      data: { user: currentUser },
      error: currentUserError,
    } = await admin.auth.getUser(accessToken);

    if (currentUserError || !currentUser) {
      return NextResponse.json(
        { success: false, error: 'You are not logged in.' },
        { status: 401 }
      );
    }

    // Only Super Admin can create users.
    const { data: currentProfile, error: profileError } = await admin
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single();

    if (profileError || currentProfile?.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Only Super Admin can create users.' },
        { status: 403 }
      );
    }

    const cleanUserId = userId.trim();
    const cleanFullName = fullName.trim();

    // Keep your existing internal email convention.
    const email =
      `${cleanUserId.toLowerCase().replace(/[^a-z0-9]/g, '')}@maiyajashoda.org`;

    // Create the Auth user through the official Supabase Auth Admin API.
    const {
      data: created,
      error: createError,
    } = await admin.auth.admin.createUser({
      email,
      password: password.trim(),
      email_confirm: true,
      user_metadata: {
        full_name: cleanFullName,
        trustee_id: cleanUserId.toUpperCase(),
      },
    });

    if (createError || !created.user) {
      return NextResponse.json(
        {
          success: false,
          error: createError?.message || 'Could not create Auth user.',
        },
        { status: 400 }
      );
    }

    const newUser = created.user;

    // Create the ERP profile linked to the real Auth user.
    const { error: profileCreateError } = await admin
      .from('profiles')
      .upsert({
        id: newUser.id,
        full_name: cleanFullName,
        trustee_id: cleanUserId.toUpperCase(),
        role: role === 'admin' ? 'super_admin' : 'trustee',
        assigned_modules: modules || [],
      });

    if (profileCreateError) {
      // Roll back Auth user if profile creation failed.
      await admin.auth.admin.deleteUser(newUser.id);

      return NextResponse.json(
        {
          success: false,
          error: `User Auth created but profile failed: ${profileCreateError.message}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: newUser.id,
      email,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Unexpected server error.',
      },
      { status: 500 }
    );
  }
}
