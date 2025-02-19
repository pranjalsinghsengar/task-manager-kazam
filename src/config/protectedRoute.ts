// import { useEffect, useState } from "react"
// import Validate from "./validate"
// import { useNavigate } from "react-router-dom"

// const token = localStorage.getItem("tsk-token")

// const ProtectedRoute = ({element}: {element: React.ReactNode}) => {
//     const navigate = useNavigate()
//     const [authorized,setAuthorized] = useState(false)
//     useEffect(() => {
//         if(token){
//             const validateToken = async () => {
//                 await Validate(token);
//                 setAuthorized(true);
//             };
//             validateToken();
//         }
//     }, [token])

//     return authorized ? element : navigate('/')
// }

// export default ProtectedRoute
