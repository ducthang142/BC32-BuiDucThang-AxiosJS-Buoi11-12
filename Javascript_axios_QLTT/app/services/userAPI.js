function apiGetUser() {
    return axios({
        url: "https://62f5093c535c0c50e768484e.mockapi.io/users",
        method: "GET",
    })
}


function apiAddUser(user) {
    return axios({
        url: "https://62f5093c535c0c50e768484e.mockapi.io/users",
        method: "POST",
        data: user,
    })
}

function apiDeleteUser(userID) {
    return axios({
        url: `https://62f5093c535c0c50e768484e.mockapi.io/users/${userID}`,
        method: "DELETE",
    })
}

function apiGetUserById(userId) {
    return axios({
      url: `https://62f5093c535c0c50e768484e.mockapi.io/users/${userId}`,
      method: "GET",
    });
  }
  
  function apiUpdateUser(userId, user) {
    return axios({
      url: `https://62f5093c535c0c50e768484e.mockapi.io/users/${userId}`,
      method: "PUT",
      data: user,
    });
  }