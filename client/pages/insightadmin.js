// import axios from 'axios';
// import React, { useEffect, useState } from 'react'
// import apiConfig from '../configs/api';

// const insightadmin = () => {
//     const [ submissions, setSubmissions ] = useState([]);
//     useEffect(()=>{
//         const fetchSubmissions = async() => {
//             const options = {
//                 method: "GET",
//                 url: `${apiConfig.url}/paper/admin`,
//               };
//               try {
//                 const res = await axios(options);
//                 setSubmissions(res.data.submissions);
//               } catch (e) {
//                 console.log(e);
//               }
//         }
//         fetchSubmissions();
//     }, [setSubmissions])
//     console.log(submissions)
//   return (
//       <div style={{
//           padding: "20px"
//       }}>
//     {
//         submissions.map((submission)=>{
//             return (
//                 <div key={submission.id} className="text-white"
//                     style={{
//                         marginBottom: "50px"
//                     }}
//                 >
//                     <p style={{
//                         fontSize: "36px",
//                         fontWeight: "bold"
//                     }}>{submission.first_name} {submission.last_name}</p>
//                      <p style={{
//                         fontSize: "16px",
//                         fontWeight: "bold"
//                     }}>email: {submission.email}</p>
//                     <p style={{
//                         fontSize: "16px",
//                         fontWeight: "bold"
//                     }}>College: {submission.college}</p>
//                     <p style={{
//                         fontSize: "16px",
//                         fontWeight: "bold"
//                     }}>Year: {submission.year}</p>
//                     <p style={{
//                         fontSize: "16px",
//                         fontWeight: "bold"
//                     }}>Topic: {submission.topic}</p>
//                     <div dangerouslySetInnerHTML={{__html: submission.submission}}></div>
//                 </div>
//             )
//         })
//     }
//     </div>
//   )
// }

// export default insightadmin
import React from 'react'

const insightadmin = () => {
  return (
    <div>insightadmin</div>
  )
}

export default insightadmin