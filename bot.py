import telebot
from telebot import types
import os
# Отключаем использование системных прокси
os.environ["HTTP_PROXY"] = ""
os.environ["HTTPS_PROXY"] = ""
os.environ["http_proxy"] = ""
os.environ["https_proxy"] = ""



# Вставьте ваш токен
TOKEN = '8543270308:AAFp-OSzWO0j6MqS0pYzfaUwIiFmRZS89Yk'
# Ссылка на ваше приложение (из Vercel)
WEB_APP_URL = 'https://grand-casino1.vercel.app/' 

bot = telebot.TeleBot(TOKEN)

@bot.message_handler(commands=['start'])
def send_welcome(message):
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    
    # Кнопка, открывающая Mini App
    webAppInfo = types.WebAppInfo(url=WEB_APP_URL)
    btn_play = types.KeyboardButton(text="🎰 Играть в Казино", web_app=webAppInfo)
    
    markup.add(btn_play)
    
    bot.send_message(
        message.chat.id, 
        f"Добро пожаловать в The Residency, {message.from_user.first_name}!\n\n"
        "Здесь играют по-крупному. Готовы рискнуть?",
        reply_markup=markup
    )

@bot.message_handler(commands=['settings'])
def settings(message):
    bot.send_message(message.chat.id, "⚙️ Настройки бота:\n\nЯзык: Русский\nУведомления: Включены\n\nДля настроек внутри игры, запустите приложение.")

@bot.message_handler(commands=['top'])
def leaderboard(message):
    # В реальном проекте тут был бы запрос к базе данных
    fake_top = (
        "🏆 ТОП БОГАЧЕЙ (Forbes):\n\n"
        "1. Sheikh Al-Maktoum — $54,000,000\n"
        "2. Baron Rothschild — $12,500,000\n"
        "3. Mr. Musk — $8,900,000\n"
        "...\n"
        "99. Вы — $1,000"
    )
    bot.send_message(message.chat.id, fake_top)

@bot.message_handler(commands=['help'])
def help_command(message):
    bot.send_message(message.chat.id, "Доступные команды:\n/start - Начать игру\n/top - Рейтинг игроков\n/settings - Настройки")

print("Бот запущен...")
bot.infinity_polling()