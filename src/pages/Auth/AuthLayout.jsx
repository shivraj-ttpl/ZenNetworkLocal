import authPoster from "@/assets/brand/auth_poster.png";
import logo from "@/assets/brand/OneTeam-Logo.png";

export default function AuthLayout({ children, footer }) {
  return (
    <div className="flex min-h-screen">
      {/* Left — poster image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src={authPoster}
          alt="OneTeam"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right — form area */}
      <div className="w-full lg:w-1/2 bg-surface flex flex-col items-center justify-center px-6 py-10 min-h-screen">
        {/* Logo */}
        <img
          src={logo}
          alt="OneTeam Logo"
          className="h-12.5 mb-8"
        />

        {/* Card */}
        <div className="w-full max-w-150 bg-neutral-100 rounded-2xl shadow-sm px-8 py-10">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="mt-8 text-center">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
