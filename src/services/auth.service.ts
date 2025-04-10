import { supabase } from "@/lib/supabase.lib";

export class AuthService {
  public static listenForAuthChanges(
    onUser: (userId: string | null) => void,
  ): () => void {
    const { data } = supabase.auth.onAuthStateChange(
      (_, session) => {
        if (session) {
          onUser(session.user.id);
        } else {
          onUser(null);
        }
      },
    );

    this.getAccessToken();

    return () => {
      data.subscription.unsubscribe();
    };
  }

  public static async getAccessToken(): Promise<string | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error(error);
      return null;
    }
    return data.session?.access_token ?? null;
  }

  public static async sendOTPCodeToEmail(email: string): Promise<void> {
    try {
      const result = await supabase.auth.signInWithOtp({
        email,
      });
      if (result.error) {
        throw result.error;
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
    // Send OTP code to email
  }
  public static async verifyOTPCode(
    email: string,
    otpCode: string,
  ): Promise<void> {
    // Verify OTP code
    try {
      const result = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "email",
      });
      if (result.error) {
        throw result.error;
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async logout(): Promise<void> {
    try {
      const result = await supabase.auth.signOut();
      if (result.error) {
        console.error(result.error);
        throw result.error;
      }
      return;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
