import { useEffect } from "react";
export default function HrMerch() {
  useEffect(() => { window.location.replace("https://www.hunterroot.com/merch"); }, []);
  return <div style={{padding:"2rem",color:"#fff"}}>Redirecting to Hunter Root merch…</div>;
}
