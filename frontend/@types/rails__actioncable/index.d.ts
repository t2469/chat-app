declare module '@rails/actioncable' {
    // 実装に応じて型をカスタマイズしてください
    export interface Subscription {
        unsubscribe(): void;
        perform(action: string, data?: any): void;
    }

    export interface SubscriptionMixin {
        connected?(): void;
        disconnected?(): void;
        received?(data: unknown): void;
        speak?(data: { content: string }): void;
    }

    export interface Cable {
        subscriptions: {
            create(
                channelParams: object | { channel: string; [key: string]: any },
                mixin: SubscriptionMixin
            ): Subscription;
        };
        disconnect(): void;
    }

    export function createConsumer(url?: string): Cable;
    export type Channel = Subscription;
}
