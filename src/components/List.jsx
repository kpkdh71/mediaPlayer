import { motion } from "framer-motion";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 82vh;
  overflow: auto;
`;

const Catalog = styled(motion.li)`
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${(props) => (props.men === props.now ? null : "black")}; //props 활용
  margin: 10px 0px;
`;

const Tab = styled.div`
  margin-left: 15px;
`;

export default function List() {
  // 강의 목록을 누르면 비디오 url을 바꾸는 형식으로 진행해야할것같음 라우터 없이 -> 성능 업그레이드
  // api요청 -> 받아옴 -> state에 저장 -> video url 변경 (초기화)
  const list = [1, 2, 3, 4, 5, 6, 7];
  // 리스트별로 현재 리스트에 색 띄우게 하지 뭐
  return (
    <Wrapper>
      {list.map((e, idx) => {
        return (
          <Catalog key={idx} whileHover={{ backgroundColor: "#dfdede" }}>
            <Tab>{e}</Tab>
          </Catalog>
        );
      })}
    </Wrapper>
  );
}

// 리스트클릭 -> 해당 강의 유닛 받아와서 -> url을 바꾸자(reload())
