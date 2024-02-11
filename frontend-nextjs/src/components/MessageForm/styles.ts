import { styled } from "styled-components";

export const Wrapper = styled.div`
  width: 70vw;
  margin: 0 auto;
`;

export const FormWrapper = styled.form`
  margin-top: 1em;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .sc-calendar,
  button {
    flex-shrink: 0;
  }

  button {
    margin-left: 1em;
  }
`;
