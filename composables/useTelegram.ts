
export const useTelegram = () => {
    const telegram = Telegram;

    return {
        getUserId: () => {
            return telegram.WebApp.initDataUnsafe.user?.id as number;
        },

        enableClosingConfirmation: () => {
            return telegram.WebApp.enableClosingConfirmation();
        }
    }
}
