import { motion } from "framer-motion";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { faBackwardStep } from "@fortawesome/free-solid-svg-icons";
import { faForwardStep } from "@fortawesome/free-solid-svg-icons";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import { faPause } from "@fortawesome/free-solid-svg-icons";
import { faClosedCaptioning } from "@fortawesome/free-solid-svg-icons";
import { faClosedCaptioning as regular } from "@fortawesome/free-regular-svg-icons";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { CCAtom, RateAtom, VideoAtom, VideoTimeCheckAtom } from "../atom";
import screenfull from "screenfull";
import pip from "../images/pip.png";
import Slider from "@mui/material/Slider";
import { useEffect, useRef, useState } from "react";

const BarWarpper = styled.div`
  height: 10%;
  width: 100%;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  background-color: transparent;
  @media screen and (max-width: 1000px) {
    bottom: 5px;
  }
  bottom: -5px;
  color: white;
`;

const ProgressTab = styled.div`
  margin-left: 15px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ControlTab = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-left: 1vw;
`;

const Icon = styled(FontAwesomeIcon)`
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
  width: 25px;
  height: 25px;
`;
const VIcon = styled(Icon)`
  margin-right: 2px;
`;
const CIcon = styled(Icon)`
  margin-left: 0px;
  margin-right: 0px;
`;

const Img = styled.img`
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
  width: 2.5vh;
  height: 2.5vh;
`;

const IconTab = styled.div`
  display: flex;
  align-items: center;
`;

const VolumnTab = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 10px;
`;

const VolumeBar = styled(motion.div)`
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
`;

const RateTab = styled(motion.div)`
  margin-left: 10px;
  margin-right: 10px;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const RateBar = styled(motion.div)`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  bottom: 25px;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: center;
`;

const Rate = styled.div`
  border-bottom: 1px solid white;
  padding: 5px 15px;
  padding: 5px;
  width: 85%;
`;

const Cc = styled.div`
  white-space: nowrap;
  padding: 5px 10px;
  border-bottom: 1px solid white;
`;

const TimeTab = styled.div`
  margin-left: 15px;
  margin-right: 5px;
`;

export default function Controller(vRef) {
  const videoRef = vRef;
  const videoVal = useRecoilValue(VideoAtom);
  const setVideoVal = useSetRecoilState(VideoAtom);
  const videoTimeVal = useRecoilValue(VideoTimeCheckAtom);
  const setVideoTimeVal = useSetRecoilState(VideoTimeCheckAtom);

  const rateVal = useRecoilValue(RateAtom);
  const setRateVal = useSetRecoilState(RateAtom);
  const CCVal = useRecoilValue(CCAtom);
  const setCCVal = useSetRecoilState(CCAtom);

  const [barOn, setBar] = useState(false);
  const currentTime =
    videoRef && videoRef.video.current
      ? videoRef.video.current.getCurrentTime()
      : "00:00";

  const duration =
    videoRef && videoRef.video.current
      ? videoRef.video.current.getDuration()
      : "00:00";

  // 남은시간

  const elapsedTime = format(currentTime);

  // 영상 총 시간을 00:00 형식으로 바꾼다. (영상 하단 00:00/00:00 에 들어갈 부분)
  const totalDuration = format(duration);

  const playHandler = () => {
    setVideoVal({ ...videoVal, playing: !videoVal.playing });
  };

  const fullHandler = () => {
    //커지면 다른것도 다커짐 그러니 state 이용해 css 변경하자
    screenfull.toggle(videoRef.video.context);
  };

  const muteHandler = () => {
    setVideoVal({ ...videoVal, muted: !videoVal.muted });
  };

  const volumeChangeHandler = (e, newValue) => {
    setVideoVal({
      ...videoVal,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  const volumeSeekUpHandler = (e, newValue) => {
    setVideoVal({
      ...videoVal,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  const rewindHandler = () => {
    videoRef.video.current.seekTo(videoRef.video.current.getCurrentTime() - 5);
  };

  const forwardHandler = () => {
    videoRef.video.current.seekTo(videoRef.video.current.getCurrentTime() + 5);
  };

  const pipHandler = () => {
    setVideoVal({ ...videoVal, pip: !videoVal.pip });
  };

  const playBackChangeHandler = (rate) => {
    setVideoVal({
      ...videoVal,
      playbackRate: rate,
    });
  };

  const ccHandler = () => {
    setVideoVal({
      ...videoVal,
      cc: !videoVal.cc,
    });
  };

  const BarOff = () => {
    setBar(false);
  };

  const BarOn = () => {
    setBar(true);
  };

  // 재생 컨트롤러가 onChange()시 발생하는 함수
  const onSeekChangeHandler = (e, newValue) => {
    setVideoVal({ ...videoVal, played: parseFloat(newValue / 100) });
  };

  // 재생 컨트롤러를 움직이고 있을 때 발생하는 함수
  const seekMouseDownHandler = (e) => {
    setVideoVal({ ...videoVal, seeking: true });
  };

  // 재생 컨트롤러에서 조정을 완료했을 때 (slider onChangeCommitted시 발생하는 함수)
  const seekMouseUpHandler = (e, newValue) => {
    setVideoVal({ ...videoVal, seeking: false });
    videoRef.video.current.seekTo(newValue / 100, "fraction");
  };

  function format(seconds) {
    if (isNaN(seconds)) {
      return `00:00`;
    }
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
  }

  function pad(string) {
    return ("0" + string).slice(-2);
  }

  const valueLabelFormat = (value) => {
    let _elapsedTime = value;
    _elapsedTime = elapsedTime;
    return _elapsedTime;
  };

  const TabVari = {
    hover: {
      scale: "1.1",
    },
    tap: {
      scale: "1",
    },
  };

  if (
    Math.trunc(currentTime / 60) !== videoTimeVal &&
    videoRef &&
    videoRef.video.current
  ) {
    setVideoTimeVal(Math.trunc(currentTime / 60));
  }

  useEffect(() => {
    setVideoVal({ ...videoVal, duration: Math.trunc(duration) });
  }, [duration]);
  return (
    <BarWarpper>
      <ProgressTab>
        <Slider
          valueLabelDisplay="auto"
          min={0}
          max={100}
          value={videoVal.played * 100}
          onChange={onSeekChangeHandler}
          onMouseDown={seekMouseDownHandler}
          onChangeCommitted={seekMouseUpHandler}
          valueLabelFormat={"~개의 질문이 있어요"}
        />

        <TimeTab>
          {elapsedTime}/{totalDuration}
        </TimeTab>
      </ProgressTab>
      <ControlTab>
        <IconTab>
          <motion.div variants={TabVari} whileHover="hover" whileTap="tap">
            <Icon icon={faBackwardStep} onClick={rewindHandler}></Icon>
          </motion.div>
          <motion.div variants={TabVari} whileHover="hover" whileTap="tap">
            {!videoVal.playing ? (
              <Icon icon={faPlay} onClick={playHandler}></Icon>
            ) : (
              <Icon icon={faPause} onClick={playHandler}></Icon>
            )}
          </motion.div>
          <motion.div variants={TabVari} whileHover="hover" whileTap="tap">
            <Icon icon={faForwardStep} onClick={forwardHandler}></Icon>
          </motion.div>
          <VolumnTab onMouseEnter={BarOn} onMouseLeave={BarOff}>
            {videoVal.muted ? (
              <VIcon icon={faVolumeXmark} onClick={muteHandler} />
            ) : (
              <VIcon icon={faVolumeUp} onClick={muteHandler} />
            )}
            <VolumeBar animate={{ scale: barOn ? 1 : 0 }}>
              <Slider
                min={0}
                max={100}
                value={
                  videoVal.muted
                    ? 0
                    : !videoVal.muted && videoVal.volume === 0
                    ? 50
                    : videoVal.volume * 100
                }
                onChange={volumeChangeHandler}
                aria-label="Default"
                onChangeCommitted={volumeSeekUpHandler}
                valueLabelDisplay="off"
              />
            </VolumeBar>
          </VolumnTab>
        </IconTab>

        <IconTab>
          <RateTab
            onClick={() => {
              setRateVal((prev) => !prev);
              // setRate((prev) => !prev);
            }}
          >
            <motion.div variants={TabVari} whileHover="hover" whileTap="tap">
              {videoVal.playbackRate}X
            </motion.div>
            {rateVal ? (
              <RateBar>
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => {
                  return (
                    <Rate
                      onClick={() => {
                        playBackChangeHandler(rate);
                      }}
                      key={rate}
                    >
                      {rate}x
                    </Rate>
                  );
                })}
              </RateBar>
            ) : null}
          </RateTab>
          <motion.div variants={TabVari} whileHover="hover" whileTap="tap">
            <Img src={pip} alt="no" onClick={pipHandler} />
          </motion.div>
          <RateTab
            onClick={() => {
              setCCVal((prev) => !prev);
            }}
          >
            <motion.div variants={TabVari} whileHover="hover" whileTap="tap">
              {videoVal.cc ? (
                <CIcon icon={faClosedCaptioning}></CIcon>
              ) : (
                <CIcon icon={regular}></CIcon>
              )}
            </motion.div>
            {CCVal ? (
              <RateBar style={{ bottom: "30px" }}>
                <Cc onClick={ccHandler}>켜기</Cc>
                <Cc onClick={ccHandler}>끄기</Cc>
              </RateBar>
            ) : null}
          </RateTab>
          <motion.div variants={TabVari} whileHover="hover" whileTap="tap">
            <Icon icon={faGear}></Icon>
          </motion.div>
          <motion.div variants={TabVari} whileHover="hover" whileTap="tap">
            <Icon icon={faExpand} onClick={fullHandler}></Icon>
          </motion.div>
        </IconTab>
      </ControlTab>
    </BarWarpper>
  );
}
