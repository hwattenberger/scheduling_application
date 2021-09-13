// import axios from "axios";
// import { useState, useEffect } from "react";
// import randomImg from "../../randomimg.png"

// const StaffLine = ({user}) => {
//     const [staffRole, setStaffRole] = useState("No Role");
//     const [roles, setRoles] = useState([]);
//     const [loaded, setLoaded] = useState(false);

//     useEffect(() => {
//         getRoles()
//     }, []);

//     // function getStaff() {
//     //     axios.get('http://localhost:5000/staff', {withCredentials: true})
//     //         .then(data => setStaff(data.data))
//     //         .catch(e => console.log("Error Staff", e))
//     // }

//     function getRoles() {
//         axios.get('http://localhost:5000/userRole', {withCredentials: true})
//             .then(result => {
//                 setRoles(result.data);
//                 setLoaded(true);
//             })
//     }

//     if(loaded) {
//         return (
//             <div className="staffLine">
//                 <img className="userPicture" src={randomImg}></img>
//                 <div>{user.email}</div>
//                 <div>{user._id}</div>
//                 <select>
//                     {roles.map((role) => (
//                         <option value={role._id}>{role.name}</option>
//                     ))}
//                 </select>
//             </div>
//         );
//     }
//     return (
//         <h1>Loading</h1>
//     )
// }

// export default StaffLine;