import React, { useEffect, useRef, useState } from "react";

interface Props {
  muted: boolean;
  camera: boolean;
  shareScreen: boolean;
  socket: any;
  peer: any;
  peers: any;
  userList: any;
}

export const VideoChat = ({
  muted,
  camera,
  shareScreen,
  socket,
  peer,
  peers,
  userList,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<any>(null);
  const [remoteStreams, setRemoteStreams] = useState<any>([]);
  const [remoteUserPeerId, setRemoteUserPeerId] = useState<string[]>([]);
  const [currentCall, setCurrentCall] = useState<any>(null);

  // useEffect(() => {
  //   const startScreenShare = async () => {
  //     if (
  //       "mediaDevices" in navigator &&
  //       "getDisplayMedia" in navigator.mediaDevices
  //     ) {
  //       try {
  //         const screenStream = await navigator.mediaDevices.getDisplayMedia({
  //           video: true,
  //         });
  //         if (screenRef.current) {
  //           screenRef.current.srcObject = screenStream;
  //         }
  //       } catch (err) {
  //         console.error("Error: " + err);
  //       }
  //     }
  //   };

  //   const stopScreenShare = () => {
  //     if (screenRef.current && screenRef.current.srcObject) {
  //       let tracks = (screenRef.current.srcObject as MediaStream).getTracks();
  //       tracks.forEach((track) => track.stop());
  //       screenRef.current.srcObject = null;
  //     }
  //   };

  //   if (shareScreen) {
  //     startScreenShare();
  //   } else {
  //     stopScreenShare();
  //   }
  // }, [shareScreen]);


  const shareVideo = (userPeerId: string) => {
    //if(userId !== peer.id){
    if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
      const config = { video: true, audio: muted }; //此处找到之前的bug。如果把video的value设置为状态变量，会导致状态变化时此处不变化。

      console.log("shared video to user", userPeerId, "camera1:", camera);
      navigator.mediaDevices
        .getUserMedia(config)
        .then((stream) => {
          console.log("local stream from connected to new user", stream);
          const call = peer.call(userPeerId, stream);
          //peers[userId] = call;
          call.on("close", () => {
            videoRef.current?.remove();
          });
        })
        .catch((err) => {
          console.error("Error accessing media devices.", err);
        });
    }
  };
  //}

  useEffect(() => {
    //新用户登入room时连接。如果自己开着camera，发送stream。
    if (peer && camera) {
      socket.on("user-connected", ({ userObj: userObj, users: users }: any) => {
        shareVideo(userObj.userPeerId);
      });
    }
  }, [peer, camera]);

  useEffect(() => {
    //开摄像头时，打开本地preview。2.关闭目前的空单向stream。3.重新建立peer.call，把本地stream发送给room内所有人。
    //此处需要满足需求：假设客户端A打开页面时没有share video，客户端B打开时也没有share video。此时客户端A打开share video，客户端B需要能接收到。
    //因此，需要率先获得全房间所有userId，然后遍历shareVideo。
    if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
      const config = { video: camera, audio: muted };
      navigator.mediaDevices
        .getUserMedia(config)
        .then((stream) => {
          const myStream = {
            userPeerId: peer.id,
            stream: stream,
          };
          setLocalStream(stream.clone());
          setRemoteStreams((prevStreams: any) => [...prevStreams, myStream]);

          // 这里也许可以加入逻辑，移除当前所有peer.call，然后重新连接？

          console.log("remoteUserId", remoteUserPeerId);
          userList.forEach((userObj: any)=>{
            shareVideo(userObj.userPeerId);
          })
        })
        .catch((err) => {
          console.error("Error accessing media devices.", err);
        });
    }
  }, [camera]);

  useEffect(() => { //接收远程peer时处理
    if (peer) {
      peer.on("call", (call: any) => {
        setRemoteUserPeerId((prev: any) => [...prev, call.peer]);
        setCurrentCall(call);

        if (!camera) {
          console.log("peer call with empty stream");
          const emptyStream = new MediaStream();
          call.answer(emptyStream);
        } else {
          console.log("peer call with local stream");
          call.answer(localStream);
        }
        call.on("stream", function (remoteStream: any) {
          const newStream = {
            userPeerId: call.peer,
            stream: remoteStream,
          };
          setRemoteStreams((prevStreams: any) => [...prevStreams, newStream]);
        });

        call.on("close", function () {
          console.log("peer close");
          //setRemoteStreams((prevStreams: any) => prevStreams.filter((stream: any) => stream.id !== call.peer));
          //call.close();
        });
      });
    }
  }, [peer, camera]);

  return (
    <div>
      <section>
        <ul className="flex gap-3 p-4 bg-primary-100">
          {userList.map((userObj: any) => {
            return (
              <div key={userObj.userPeerId}>
                {remoteStreams.findIndex(
                  (remoteStream: any) => remoteStream.userPeerId === userObj.userPeerId
                ) < 0 ? (
                  <li className="w-[180px] h-[136px] px-3 py-2 bg-primary-400 text-secondary rounded-xl border-2 border-secondary-400">
                    {userObj.userName}
                  </li>
                ) : (
                  <video
                    key={userObj.userPeerId}
                    className={`w-[180px] h-[136px] rounded-xl border-2 ${
                      userObj.userPeerId === peer.id
                        ? "border-quaternary"
                        : "border-secondary-400"
                    }`}
                    ref={(ref) =>
                      ref &&
                      (ref.srcObject = remoteStreams.find(
                        (item: any) => item.userPeerId === userObj.userPeerId
                      )?.stream)
                    }
                    autoPlay
                    playsInline
                    muted
                  />
                )}
              </div>
            );
          })}
        </ul>
      </section>
      {/* <section>
        {remoteStreams.map((streamObj: any, index: number) => (
          <video
            key={index}
            className="w-[40vw]"
            ref={(ref) => ref && (ref.srcObject = streamObj.stream)}
            autoPlay
            playsInline
            muted
          />
        ))}
      </section> */}
      <video className="w-[40vw]" ref={screenRef} autoPlay playsInline />
    </div>
  );
};
