import { useState, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

import * as S from "./styles";

type Message = {
  id: string;
  ttl: string;
  text: string;
  isExpired: string;
};

export const MessageList = () => {
  const [error, setError] = useState("");
  const [list, setList] = useState<Message[]>([]);

  const sse = useRef<null | EventSource>(null);

  useEffect(() => {
    initSse();
    initExpiredMessages();

    return () => {
      if (sse.current) {
        sse.current.onmessage = null;
        sse.current.close();
        sse.current = null;
      }
    };
  }, []);

  function initSse() {
    if (!sse.current) {
      sse.current = new EventSource(`${process.env.NEXT_PUBLIC_BASE_URL}/sse`);

      sse.current.onmessage = ({ data }) => {
        try {
          const newMessage = JSON.parse(data);
          setList((prevState) => [newMessage, ...prevState]);
        } catch (err) {
          setError(`Error while parsing sse-event-message: ${String(err)}`);
        }
      };
    }
  }

  async function initExpiredMessages() {
    try {
      const resp = await fetch(String(process.env.NEXT_PUBLIC_BASE_URL));

      if (!resp.ok)
        throw new Error(
          `Invalid response: ${resp.status} - ${resp.statusText}`
        );

      const messages = await resp.json();

      setList(messages);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  }

  const handlerDelete = async (id: string) => {
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}?id=${id}`, {
        method: "DELETE",
      });

      if (!resp.ok)
        throw new Error(
          `Invalid response: ${resp.status} - ${resp.statusText}`
        );

      setList((prevState) => {
        return prevState.filter((msg) => msg.id !== id);
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };

  return (
    <S.Wrapper>
      <Typography
        variant="h4"
        component="h2"
        align="center"
        fontWeight="fontWeightMedium"
      >
        Message list
      </Typography>

      <br />

      <Slide in={!!error} direction="left" mountOnEnter unmountOnExit>
        <Alert severity="error">{error}</Alert>
      </Slide>

      <br />

      <ul>
        {list.map((message) => (
          <Card variant="outlined" component="li" key={message.id}>
            <CardContent>
              <Typography>
                {message.id} - {message.text}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="error"
                onClick={() => handlerDelete(message.id)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </ul>
    </S.Wrapper>
  );
};
