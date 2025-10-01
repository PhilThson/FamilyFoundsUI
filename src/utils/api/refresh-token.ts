import { jwtDecode } from "jwt-decode";
import { authApiSlice } from "../../store/auth-slice";
import { AppDispatch } from "../../store";
import { authSliceActions } from "../../store/auth-actions";

interface JwtPayload {
  exp: number;
}

let refreshTimeoutId: number | null = null;

export const scheduleTokenRefresh = (token: string, dispatch: AppDispatch) => {
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId);
  }

  try {
    const { exp } = jwtDecode<JwtPayload>(token);

    const expiration = exp * 1000;
    const now = Date.now();

    // refresh 1 minute before expiration
    const refreshAt = expiration - now - 60_000;
    if (refreshAt <= 0) return;

    refreshTimeoutId = window.setTimeout(async () => {
      try {
        const result = await dispatch(
          authApiSlice.endpoints.refreshToken.initiate()
        ).unwrap();
        // update Redux + reschedule
        dispatch(authSliceActions.updateLoginState(result));
        scheduleTokenRefresh(result.jwtToken, dispatch);
      } catch (err) {
        console.error("Failed to refresh token", err);
        dispatch(authSliceActions.clearLoginState());
      }
    }, refreshAt);
  } catch (e) {
    console.error("Could not decode JWT", e);
  }
};
