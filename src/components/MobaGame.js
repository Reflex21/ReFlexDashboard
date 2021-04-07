import React from 'react'
import Unity, { UnityContent } from 'react-unity-webgl'

const MobaGame = () => {
  const unityContent = new UnityContent({
    loaderUrl: 'public/webmoba/Build/UnityLoader.js',
    dataUrl: 'public/webmoba/Build/webmoba.data',
    frameworkUrl: 'public/webmoba/Build/webmoba.framework.js',
    codeUrl: 'public/webmoba/Build/webmoba.wasm',
  })

  return (
    <Unity unityContent={unityContent} />
  )
}

export default MobaGame
