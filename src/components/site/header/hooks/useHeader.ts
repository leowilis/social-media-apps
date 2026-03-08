import { usePathname, useRouter } from "next/navigation";

const Profile_Routes = ["/myprofile", "/editprofile", "/addpost"];

function getProfileTitle(pathname: string) {
  if (pathname === "/addpost") return "Add Post";
  if (pathname === "/editprofile") return "Edit Profile";
  if (pathname === "/myprofile") return "My Profile";
  if (!pathname.startsWith("/profile")) return "Profile";

  const profileId = pathname.split("/")[2] ?? "";
  if (!profileId || profileId.toLowerCase() === "id") return "My Profile";

  const words = profileId.replace(/[-_]+/g, " ").split(" ").filter(Boolean);
  return words.map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}

export function useHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const isProfileRoute =
    Profile_Routes.includes(pathname) || pathname.startsWith("/profile/");

  const profileTitle = getProfileTitle(pathname);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    if (pathname === "/editprofile") {
      router.push("/myprofile");
      return;
    }
    router.push("/home");
  };
  return { pathname, isProfileRoute, profileTitle, handleBack };
}
