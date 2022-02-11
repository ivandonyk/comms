import { useRegisterActions } from "kbar";
import { IPost } from "utils/types";
import "moment-timezone";
import moment from "moment";
import { getSecondsFromNextWeekend } from "../helpers";

// Default snooze options
export const snoozeOptions = [
  {
    name: "in 5 secs",
    value: 5,
  },
  {
    name: "in 10 secs",
    value: 10,
  },
  {
    name: "tomorrow",
    value: 86400,
  },
  {
    name: "next week",
    value: 604800,
  },
  {
    name: "this weekend",
    value: getSecondsFromNextWeekend(),
  },
  {
    name: "next month",
    value: 2.592e6,
  },
];

const searchId = "inbox1";

interface InboxHotkeysProps {
  post?: IPost | null;
  markAsDone: (post: IPost) => void;
  snoozePost: (post: IPost, time: any) => void;
}

export function useInboxHotkeys({
  post,
  markAsDone,
  snoozePost,
}: InboxHotkeysProps) {
  const rootSearchActions = [
    {
      id: searchId,
      name: "Inbox Actions",
      keywords: "inbox #",
      shortcut: ["i"],
      section: "Inbox",
    },
    {
      id: "done",
      parent: searchId,
      name: "Mark as Done",
      keywords: `mark done triage`,
      shortcut: ["e"],
      section: "Inbox",
      perform: () => post && markAsDone(post),
    },
    {
      id: "remind",
      parent: searchId,
      name: "Remind Me",
      keywords: `remind me`,
      shortcut: ["h"],
      section: "Inbox",
    },
  ];

  // Map snooze options into kbar actions
  const snoozeActions = snoozeOptions?.map(({ name, value }) => ({
    id: name,
    parent: "remind",
    name,
    keywords: `remind notify snooze me in ${value}`,
    shortcut: [
      moment(new Date(), "DD-MM-YYYY hh:mm")
        .add(value, `seconds`)
        .format("ddd, MMM Do"),
    ],
    section: "Inbox",
    perform: () => post && snoozePost(post, value),
  }));

  // Register hotkeys for inbox actions
  useRegisterActions([...rootSearchActions, ...snoozeActions], [post]);
}
