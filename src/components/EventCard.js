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
  } = props;

  const router = useRouter();

  const onCardClick = () => {
    // Logic in here to push the user to the form they clicked with eventCode
    if (isAdminCard) {
      router.push({
        pathname: `/event/${eventCode}`,
        query: { isAdminCard: true },
      });
    } else {
      router.push(`/event/${eventCode}`);
    }
  };

  return (
    <Card
      isHoverable
      isPressable
      variant="bordered"
      color="primary"
      onPress={onCardClick}
    >
      <Card.Body css={{ justifyContent: "center", textAlign: "center" }}>
        <Text h4>{name}</Text>
        <Text b>
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
        {isSubmissionClosed && (
          <Text>Click the card to see your shitty picks</Text>
        )}
      </Card.Body>
    </Card>
  );
}
