import CryptoJS from "crypto-js";


export const saveToken = (data) => {
  localStorage.setItem("token", data?.token);
  localStorage.setItem('loginType', CryptoJS.AES.encrypt((data?.loginType), 'application').toString())
  if (data?.loginType === 'master') {
    localStorage.setItem('masterId', CryptoJS.AES.encrypt((data?.masterId), 'application').toString())
  }
  if (data?.loginType === 'user') {
    localStorage.setItem('userId', CryptoJS.AES.encrypt((data?.userId), 'application').toString())
  }
  
  
 
};


export const getToken = () => {
  return localStorage.getItem("token");
};

export const getproductId = () => {
  const masterId = localStorage.getItem('masterId')
  return CryptoJS.AES.decrypt(masterId, 'application').toString(CryptoJS.enc.Utf8)
};

export const getuserId = () => {
  const userId = localStorage.getItem('userId');
  console.log("Stored Encrypted UserId:", userId); // Log the stored value

  try {
    const decryptedUserId = CryptoJS.AES.decrypt(userId, 'application').toString(CryptoJS.enc.Utf8);
    if (decryptedUserId) {
      console.log("Decrypted User ID:", decryptedUserId);
      return decryptedUserId;
    } else {
      console.error("Decryption failed. User ID might be invalid.");
      return null;
    }
  } catch (error) {
    console.error("Error during decryption:", error);
    return null;
  }
};





export const getLoginType = () => {
  const loginType = localStorage.getItem('loginType')
  return CryptoJS.AES.decrypt(loginType, 'application').toString(CryptoJS.enc.Utf8)
};

export const clearStorage = () => {
  localStorage.clear()
};