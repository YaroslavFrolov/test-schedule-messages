import { useState } from "react";
import { toDate, isValid, differenceInSeconds } from "date-fns";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";

import * as S from "./styles";

import type { FormEvent } from "react";

export const MessageForm = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [TTL, setTTL] = useState<number | null>(null);

  const scheduleMessage = async (text: string, expiredInSec: number) => {
    setIsLoading(true);

    try {
      const resp = await fetch(String(process.env.NEXT_PUBLIC_BASE_URL), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          ttl: expiredInSec,
        }),
      });

      if (!resp.ok)
        throw new Error(
          `Invalid response: ${resp.status} - ${resp.statusText}`
        );

      setTTL(expiredInSec);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlerSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const text = e.currentTarget.text.value;
    const dateString = e.currentTarget.date.value;
    const dateScheduled = toDate(dateString);
    const dateNow = new Date();
    const expiredInSec = differenceInSeconds(dateScheduled, dateNow);

    if (text.trim().length < 1) {
      setError("text");
      return null;
    }

    if (!isValid(dateScheduled)) {
      setError("Please set valid date and time.");
      return null;
    }

    if (expiredInSec < 1) {
      setError("Date and time should be in future.");
      return null;
    }

    scheduleMessage(text, expiredInSec);
  };

  const handlerClose = () => {
    setTTL(null);
  };

  const dateMin = Date.now() + 60000; // +1min

  return (
    <S.Wrapper>
      <Slide in={!!error} direction="left" mountOnEnter unmountOnExit>
        <Alert severity="error">
          {error === "text" ? "The message field is required" : error}
        </Alert>
      </Slide>

      <S.FormWrapper onSubmit={handlerSubmit}>
        <TextField
          id="outlined-basic"
          label="Write your message here ..."
          variant="outlined"
          name="text"
          error={error === "text"}
          fullWidth
          onChange={(_) => setError("")}
          disabled={isLoading}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Select date and time"
            ampm={false}
            disablePast
            minDate={dateMin}
            defaultValue={dateMin}
            name="date"
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            className="sc-calendar"
            onChange={(_) => setError("")}
            disabled={isLoading}
          />
        </LocalizationProvider>

        <Button type="submit" variant="contained" disabled={isLoading}>
          Schedule message
        </Button>
      </S.FormWrapper>

      <Dialog
        onClose={handlerClose}
        aria-labelledby="dialog-title"
        open={typeof TTL === "number"}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="dialog-title">
          Your message was added to scheduler successfully.
        </DialogTitle>

        <DialogContent dividers>
          <Typography gutterBottom>
            It will appear here in {TTL} seconds. Does not matter your current
            location, or future location, or time/timezone settings in your
            device.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handlerClose}>
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </S.Wrapper>
  );
};
