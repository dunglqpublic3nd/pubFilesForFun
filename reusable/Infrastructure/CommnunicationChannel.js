import { toArray } from "../DOM_Manipulators.js";

export class CommunicationChannel {
    constructor(name) {
        this.channelName = name;
        this.topics = new Map();
    }

    subscribe(topic, entity) {
        let setReceivers;
        if (this.hasTopic(topic)) {
            setReceivers = this.topics.get(topic);
        } else {
            setReceivers = new Set();
            this.topics.set(topic, setReceivers);
        }
        setReceivers.add(entity)
    }

    unsubscribe(topic, entity) {
        if (this.hasTopic(topic)) {
            let receivers = this.topics.get(topic);
            receivers.delete(entity)
        }
    }

    removeTopic(topic) {
        this.topics.delete(topic)
    }

    deliver(topic, message, sender) {
        if (this.hasTopic(topic)) {
            console.log("delivering message", message, "on topic: ", topic);
            let receivers = this.topics.get(topic);
            let results = toArray(receivers).map(reciepent => invokeReceipent(reciepent, topic, message))
            if (!results.every(x => x)) {
                if (sender) {
                    if ("onMessageReturned" in sender) {
                        sender.onMessageReturned (topic,message);
                    } else {
                        console.error("Sender doesn't conform constraint onMessageReturned")
                    }
                } else {
                    console.error("Caller doesn't provide sender paramenter")
                }
            }
        } else {
            console.error(`Topic ${topic} is not yet defined`);
        }
    }

    hasTopic(topic) {
        return this.topics.has(topic);
    }
}

function invokeReceipent(reciepent, topic, message) {
    if ("onMessageArrive" in reciepent) {
        reciepent.onMessageArrive(topic, message);
        return true;
    } else {
        console.error("Receipent doesn't conform interface. Missing onMessageArrive method is missing", reciepent)
        return false;

    }
}