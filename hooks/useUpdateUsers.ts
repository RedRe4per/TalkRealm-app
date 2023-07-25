import { useEffect } from 'react';

function useUpdateUsers(userList: any, localUser: any, remoteUsers: any, setUserFuncs: any) {
  function isUserEqual(newState: any, prevState: any | null): boolean {
    if (prevState === null) return false;
    return newState.isActive === prevState.isActive
      && newState.userId === prevState.userId
      && newState.userPeerId === prevState.userPeerId
      && newState.userName === prevState.userName
      && newState.audio === prevState.audio
      && newState.video === prevState.video
      && newState.screen === prevState.screen;
  }

  useEffect(() => {
    for(let remoteUser of remoteUsers) {
        if(userList.findIndex((user: any) => user.userPeerId === remoteUser?.userPeerId) < 0) {
            const index = remoteUsers.findIndex((user: any) => user?.userPeerId === remoteUser?.userPeerId)
            setUserFuncs.current[index](null); 
        }
    }

    for (let user of userList) {
      if (user.userPeerId === localUser?.userPeerId) continue;
      const index = remoteUsers.findIndex((remoteUser: any) => remoteUser?.userPeerId === user.userPeerId);
      if (index < 0) {
        const emptyIndex = remoteUsers.findIndex((remoteUser: any) => remoteUser === null);
        setUserFuncs.current[emptyIndex](user);
      } else {
        if (!isUserEqual(user, remoteUsers[index])) {
          setUserFuncs.current[index](user);
        }
      }
    }
  }, [userList, localUser, ...remoteUsers]);
}

export default useUpdateUsers;
