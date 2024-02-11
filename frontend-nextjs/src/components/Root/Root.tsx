import dynamic from "next/dynamic";
import type React from "react";
import Typography from "@mui/material/Typography";
import { MessageForm } from "components/MessageForm";
import { MessageList } from "components/MessageList";

type Props = {
  children: React.ReactNode;
};

const NoSSR = dynamic(() => Promise.resolve((props: Props) => props.children), {
  ssr: false,
});

export const Root = () => {
  return (
    <NoSSR>
      <Typography
        variant="h4"
        component="h1"
        align="center"
        fontWeight="fontWeightBold"
      >
        Message Sheduler
      </Typography>

      <br />

      <MessageForm />

      <br />
      <br />
      <br />

      <MessageList />
    </NoSSR>
  );
};
