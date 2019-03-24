import * as type from "../constants"
import { saveData } from "../utils"

export const loginAction = isAuth => ({
  type: type.LOGIN_SUCCESS,
  isAuth: isAuth
})

export const islogin = (token, user) => {
  saveData(type.TOKEN, token)
  return loginAction(user)
}

export const logout = () => {
  window.localStorage.removeItem(type.TOKEN)
  return {
    type: type.LOGOUT_SUCCESS
  }
}

export const changeShowTime = time => ({
  type: type.CHANGE_SHOW_TIME,
  visibleTime: time
})
