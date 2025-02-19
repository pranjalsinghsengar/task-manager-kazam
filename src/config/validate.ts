import axios from "axios";
import { API_URL } from "./config";

const Validate = (token: string) => {
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${API_URL}/user/verifyToken`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  axios
    .request(config)
    .then((response) => {
      //   console.log(JSON.stringify(response.data));
      if (!response.data.success) {
        localStorage.removeItem("tsk-token");
        localStorage.removeItem("tsk-user");
      }
      return;
    })
    .catch((error) => {
      console.error(error);
      localStorage.removeItem("tsk-token");
      localStorage.removeItem("tsk-user");
    });
};

export default Validate;
