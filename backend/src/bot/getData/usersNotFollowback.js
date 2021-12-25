module.exports = ({followings, followers, expectedLength}) => new Promise(async (resolve, reject) => {
    let userNotFollowback = []

    for (let i = 0; i < followings.length; i++) {
      let isNotFollowback = true
  
      for (let j = 0; j < followers.length; j++) {
        if(followings[i] !== followers[j]) {
          isNotFollowback = true
        } else if(followings[i] === followers[j]) {
          isNotFollowback = false
          break;
        }
      }
  
      if(isNotFollowback) {
        userNotFollowback.push(followings[i])
      }

      if(userNotFollowback.length >= expectedLength) break;
    }

    return resolve(userNotFollowback)
})