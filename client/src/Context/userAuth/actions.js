const ROOT_URL = ''

export async function loginUser(dispatch, loginPayload) {
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    dispatch({ type: 'REQUEST_LOGIN' });
    
    return await axios.post(`${baseURL}/auth/login`, JSON.stringify(loginPayload),{
        headers: {'Content-Type': 'application/json'}, withCredentials: true
    })
        .then(data => window.open("/", "_self"))
        .catch(e => {
            if (e.response.data && e.response.data.message) setError(e.response.data.message)
            else setError("Incorrect username or password")
        })
}