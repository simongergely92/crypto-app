import styled from "styled-components";

export const CoinsPageWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${(props) => props.theme.text};
  padding-left: 60px;
  padding-right: 60px;
`;
export const ChartsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
`;
export const ChartsWrapperInner = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
export const TopChartHeaderRow = styled.div`
  width: 90%;
  display: flex;
  align-items: center;
  margin-top: -280px;
  position: absolute;
`;
export const ArrowUp = styled.div`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid #00fc2a;
  margin-right: 5px;
`;
export const ArrowDown = styled.div`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #fe1040;
  margin-right: 5px;
`;
