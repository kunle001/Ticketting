import { ExpirationCompleteEvent, Publisher, Subjects } from "@kunleticket/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompleteEvent>{
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}