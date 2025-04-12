
- 左边展示信息，右边展示句子列表
- 左边需要展示 Remotion Player
- 右边的句子列表上有一个生成录音的按钮，点击这个按钮会调用一个 action生成音频，使用 fm tts 来生成，生成 tts 之后，存储文件在 createOperationDir($id)下面，还需要通过 ffmpeg 来检测音频文件的时长，这个检测函数可以放置到utils/ffmpeg.ts 文件下面