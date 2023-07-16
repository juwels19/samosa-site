import { useRouter } from "next/router";
import moment from "moment";
import { Card, Text } from "@nextui-org/react";

export default function EventCard(props) {
  const {
    name,
    startDate,
    endDate,
    isSubmissionClosed,
    eventCode,
    isAdminCard,
    isComplete,
  } = props;

  const router = useRouter();

  const onCardClick = () => {
    // Logic in here to push the user to the form they clicked with eventCode
    if (isAdminCard) {
      router.push(`/event/${eventCode}/admin`);
    } else {
      router.push(`/event/${eventCode}`);
    }
  };

  return (
    <Card
      isHoverable
      isPressable
      variant="bordered"
      onPress={onCardClick}
      css={{
        minHeight: "inherit",
      }}
    >
      <Card.Body css={{ justifyContent: "center" }}>
        <Text h4 css={{ textAlign: "center" }}>
          {name}
        </Text>
        <Text b css={{ textAlign: "left" }}>
          Event Dates:{" "}
          <span style={{ fontWeight: "normal" }}>
            {moment(startDate).format("MMMM Do")} to{" "}
            {moment(endDate).format("MMMM Do")}
          </span>
        </Text>
        <Text as="b">
          Submissions Due:{" "}
          <span style={{ fontWeight: "normal" }}>
            {moment(startDate)
              .subtract(1, "day")
              .endOf("day")
              .format("MMMM Do, h:mm:ss a")}
          </span>
        </Text>
        {(isSubmissionClosed || isComplete) && (
          <Text as="b" css={{ color: "$red700" }}>
            Submissions are closed so click to see your shitty picks...
          </Text>
        )}
      </Card.Body>
    </Card>
  );
}
