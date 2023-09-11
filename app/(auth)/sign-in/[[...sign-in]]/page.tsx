import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div style={{ marginLeft: "35%", marginTop: "5%" }}>
      <SignIn />
    </div>
  )

}