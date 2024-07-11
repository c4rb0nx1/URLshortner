import axios from 'axios';

const API_URL = 'http://localhost:9999/shortner';

export const register = async (name, email, password) => {
  try{
    const response = await axios.post(`${API_URL}/newuser`, { name, email, password })
    if(response.data.statusCode === 400){
        console.log("error found")
        console.log("\nResponse data: ",response.data)
        throw new Error(response.data.name)
    }else{
        console.log('Successful response:', response.data);
        return response.data
    }
        
  }catch(err){
    console.log("Logging error")
    console.log(err)
    throw new Error("Failed to validate, check input constraints")

  }
}