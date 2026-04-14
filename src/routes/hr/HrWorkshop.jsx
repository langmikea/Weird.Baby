import { Link } from "react-router-dom";
export default function HrWorkshop() {
  return (
    <div style={{padding:"2rem",color:"#fff"}}>
      <h2>Workshop</h2>
      <ul>
        <li><Link to="/hr/workshop/lyric-map" style={{color:"#aef"}}>Lyric Map</Link></li>
      </ul>
    </div>
  );
}
