const ROOT_URL = ''

export async function loginUser(dispatch, loginPayload) {

    dispatch({ type: 'REQUEST_LOGIN' });
    
    return await axios.post('http://localhost:5000/auth/login', JSON.stringify(loginPayload),{
        headers: {'Content-Type': 'application/json'}, withCredentials: true
    })
        .then(data => window.open("/", "_self"))
        .catch(e => {
            if (e.response.data && e.response.data.message) setError(e.response.data.message)
            else setError("Incorrect username or password")
        })
}