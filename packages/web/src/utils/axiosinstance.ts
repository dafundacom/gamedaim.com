import axios from "axios"
import env from "@/env"
const axiosInstance = axios.create({
  baseURL: env.API,
})

export default axiosInstance
