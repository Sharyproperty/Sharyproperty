
/*
 * أيقونات السوشيال والمتاجر (واتساب، فيسبوك، آبل ...) — بدل تحميل مكتبة Font Awesome كلها (حوالي 550 كيلو جافاسكربت) عشان الصفحة تفتح أسرع.
 * الاستخدام زي ما هو: <i class="fa-brands fa-whatsapp"></i> — السكربت بيبدّل العنصر بـ SVG جاهز (ولو اتضاف عنصر بعد التحميل، زي نافذة المشاركة، بيتبدّل برضه).
 * لو محتاج أيقونة مش موجودة هنا: زوّد سطر في ICONS (العرض، الارتفاع، مسار الـ SVG).
 * Icons: Font Awesome Free (fontawesome.com) — CC BY 4.0.
 */
(function () {
    'use strict';
    var ICONS = {"whatsapp":[448,512,"M380.9 97.1c-41.9-42-97.7-65.1-157-65.1-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480 117.7 449.1c32.4 17.7 68.9 27 106.1 27l.1 0c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1s56.2 81.2 56.1 130.5c0 101.8-84.9 184.6-186.6 184.6zM325.1 300.5c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8s-14.3 18-17.6 21.8c-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7s-12.5-30.1-17.1-41.2c-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4s4.6-24.1 3.2-26.4c-1.3-2.5-5-3.9-10.5-6.6z"],"facebook-f":[320,512,"M80 299.3l0 212.7 116 0 0-212.7 86.5 0 18-97.8-104.5 0 0-34.6c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4 .4 37 1.2l0-88.7C291.4 4 256.4 0 236.2 0 129.3 0 80 50.5 80 159.4l0 42.1-66 0 0 97.8 66 0z"],"facebook":[512,512,"M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5l0-170.3-52.8 0 0-78.2 52.8 0 0-33.7c0-87.1 39.4-127.5 125-127.5 16.2 0 44.2 3.2 55.7 6.4l0 70.8c-6-.6-16.5-1-29.6-1-42 0-58.2 15.9-58.2 57.2l0 27.8 83.6 0-14.4 78.2-69.3 0 0 175.9C413.8 494.8 512 386.9 512 256z"],"instagram":[448,512,"M224.3 141a115 115 0 1 0 -.6 230 115 115 0 1 0 .6-230zm-.6 40.4a74.6 74.6 0 1 1 .6 149.2 74.6 74.6 0 1 1 -.6-149.2zm93.4-45.1a26.8 26.8 0 1 1 53.6 0 26.8 26.8 0 1 1 -53.6 0zm129.7 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM399 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"],"x-twitter":[448,512,"M357.2 48L427.8 48 273.6 224.2 455 464 313 464 201.7 318.6 74.5 464 3.8 464 168.7 275.5-5.2 48 140.4 48 240.9 180.9 357.2 48zM332.4 421.8l39.1 0-252.4-333.8-42 0 255.3 333.8z"],"twitter":[512,512,"M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103l0-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z"],"youtube":[576,512,"M549.7 124.1C543.5 100.4 524.9 81.8 501.4 75.5 458.9 64 288.1 64 288.1 64S117.3 64 74.7 75.5C51.2 81.8 32.7 100.4 26.4 124.1 15 167 15 256.4 15 256.4s0 89.4 11.4 132.3c6.3 23.6 24.8 41.5 48.3 47.8 42.6 11.5 213.4 11.5 213.4 11.5s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zM232.2 337.6l0-162.4 142.7 81.2-142.7 81.2z"],"tiktok":[448,512,"M448.5 209.9c-44 .1-87-13.6-122.8-39.2l0 178.7c0 33.1-10.1 65.4-29 92.6s-45.6 48-76.6 59.6-64.8 13.5-96.9 5.3-60.9-25.9-82.7-50.8-35.3-56-39-88.9 2.9-66.1 18.6-95.2 40-52.7 69.6-67.7 62.9-20.5 95.7-16l0 89.9c-15-4.7-31.1-4.6-46 .4s-27.9 14.6-37 27.3-14 28.1-13.9 43.9 5.2 31 14.5 43.7 22.4 22.1 37.4 26.9 31.1 4.8 46-.1 28-14.4 37.2-27.1 14.2-28.1 14.2-43.8l0-349.4 88 0c-.1 7.4 .6 14.9 1.9 22.2 3.1 16.3 9.4 31.9 18.7 45.7s21.3 25.6 35.2 34.6c19.9 13.1 43.2 20.1 67 20.1l0 87.4z"],"snapchat":[512,512,"M497.1 366.6c-3.4-9.2-9.8-14.1-17.1-18.2-1.4-.8-2.6-1.5-3.7-1.9-2.2-1.1-4.4-2.2-6.6-3.4-22.8-12.1-40.6-27.3-53-45.4-3.5-5.1-6.6-10.5-9.1-16.1-1.1-3-1-4.7-.2-6.3 .8-1.2 1.7-2.2 2.9-3 3.9-2.6 8-5.2 10.7-7 4.9-3.2 8.8-5.7 11.2-7.4 9.4-6.5 15.9-13.5 20-21.3 2.9-5.4 4.5-11.3 4.9-17.4s-.6-12.2-2.8-17.8c-6.2-16.3-21.6-26.4-40.3-26.4-3.9 0-7.9 .4-11.7 1.2-1 .2-2.1 .5-3.1 .7 .2-11.2-.1-22.9-1.1-34.5-3.5-40.8-17.8-62.1-32.7-79.2-9.5-10.7-20.7-19.7-33.2-26.7-22.6-12.9-48.2-19.4-76.1-19.4s-53.4 6.5-76 19.4c-12.5 7-23.7 16.1-33.3 26.8-14.9 17-29.2 38.4-32.7 79.2-1 11.6-1.2 23.4-1.1 34.5-1-.3-2-.5-3.1-.7-3.9-.8-7.8-1.2-11.7-1.2-18.7 0-34.1 10.1-40.3 26.4-2.2 5.7-3.2 11.8-2.8 17.8s2 12 4.9 17.4c4.1 7.8 10.7 14.7 20 21.3 2.5 1.7 6.4 4.2 11.2 7.4 2.6 1.7 6.5 4.2 10.3 6.7 1.3 .9 2.4 2 3.3 3.3 .8 1.6 .8 3.4-.4 6.6-2.5 5.5-5.5 10.8-8.9 15.8-12.1 17.7-29.4 32.6-51.4 44.6-11.7 6.2-23.9 10.3-29 24.3-3.9 10.5-1.3 22.5 8.5 32.6 3.6 3.8 7.8 6.9 12.4 9.4 9.6 5.3 19.8 9.3 30.3 12.1 2.2 .6 4.3 1.5 6.1 2.7 3.6 3.1 3.1 7.9 7.8 14.8 2.4 3.6 5.4 6.7 9 9.1 10 6.9 21.3 7.4 33.2 7.8 10.8 .4 23 .9 36.9 5.5 5.8 1.9 11.8 5.6 18.7 9.9 16.7 10.3 39.6 24.3 77.8 24.3s61.3-14.1 78.1-24.4c6.9-4.2 12.9-7.9 18.5-9.8 13.9-4.6 26.2-5.1 36.9-5.5 11.9-.5 23.2-.9 33.2-7.8 4.2-2.9 7.7-6.7 10.2-11.2 3.4-5.8 3.4-9.9 6.6-12.8 1.8-1.2 3.7-2.1 5.8-2.6 10.7-2.8 21-6.9 30.8-12.2 4.9-2.6 9.3-6.1 13-10.2l.1-.2c9.2-9.9 11.5-21.5 7.8-31.8zm-34 18.3c-20.7 11.5-34.5 10.2-45.3 17.1-9.1 5.9-3.7 18.5-10.3 23.1-8.1 5.6-32.2-.4-63.2 9.9-25.6 8.5-42 32.8-88 32.8s-62-24.3-88.1-32.9c-31-10.3-55.1-4.2-63.2-9.9-6.6-4.6-1.2-17.2-10.3-23.1-10.7-6.9-24.5-5.7-45.3-17.1-13.2-7.3-5.7-11.8-1.3-13.9 75.1-36.4 87.1-92.6 87.7-96.7 .6-5 1.4-9-4.2-14.1-5.4-5-29.2-19.7-35.8-24.3-10.9-7.6-15.7-15.3-12.2-24.6 2.5-6.5 8.5-8.9 14.9-8.9 2 0 4 .2 6 .7 12 2.6 23.7 8.6 30.4 10.2 .8 .2 1.6 .3 2.5 .3 3.6 0 4.9-1.8 4.6-5.9-.8-13.1-2.6-38.7-.6-62.6 2.8-32.9 13.4-49.2 26-63.6 6.1-6.9 34.5-37 88.9-37S339 74.2 345 81.1c12.6 14.4 23.2 30.7 26 63.6 2.1 23.9 .3 49.5-.6 62.6-.3 4.3 1 5.9 4.6 5.9 .8 0 1.7-.1 2.5-.3 6.7-1.6 18.4-7.6 30.4-10.2 2-.4 4-.7 6-.7 6.4 0 12.4 2.5 14.9 8.9 3.5 9.4-1.2 17-12.2 24.6-6.6 4.6-30.4 19.3-35.8 24.3-5.6 5.1-4.8 9.1-4.2 14.2 .5 4.2 12.5 60.4 87.7 96.7 4.4 2.2 11.9 6.7-1.3 14.1z"],"linkedin-in":[448,512,"M100.3 448l-92.9 0 0-299.1 92.9 0 0 299.1zM53.8 108.1C24.1 108.1 0 83.5 0 53.8 0 39.5 5.7 25.9 15.8 15.8s23.8-15.8 38-15.8 27.9 5.7 38 15.8 15.8 23.8 15.8 38c0 29.7-24.1 54.3-53.8 54.3zM447.9 448l-92.7 0 0-145.6c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7l0 148.1-92.8 0 0-299.1 89.1 0 0 40.8 1.3 0c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3l0 164.3-.1 0z"],"linkedin":[448,512,"M416 32L31.9 32C14.3 32 0 46.5 0 64.3L0 447.7C0 465.5 14.3 480 31.9 480L416 480c17.6 0 32-14.5 32-32.3l0-383.4C448 46.5 433.6 32 416 32zM135.4 416l-66.4 0 0-213.8 66.5 0 0 213.8-.1 0zM102.2 96a38.5 38.5 0 1 1 0 77 38.5 38.5 0 1 1 0-77zM384.3 416l-66.4 0 0-104c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9l0 105.8-66.4 0 0-213.8 63.7 0 0 29.2 .9 0c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9l0 117.2z"],"telegram":[512,512,"M256 8a248 248 0 1 0 0 496 248 248 0 1 0 0-496zM371 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5c-2.2 .5-37.1 23.5-104.6 69.1-9.9 6.8-18.9 10.1-26.9 9.9-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3 .6-4.5 6.7-9 18.4-13.7 72.3-31.5 120.5-52.3 144.6-62.3 68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9 2 1.7 3.2 4.1 3.5 6.7 .5 3.2 .6 6.5 .4 9.8z"],"apple":[384,512,"M319.1 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7-55.8 .9-115.1 44.5-115.1 133.2 0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM262.5 104.5c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"],"google-play":[448,512,"M293.6 234.3L72.9 13 353.7 174.2 293.6 234.3zM15.3 0C2.3 6.8-6.4 19.2-6.4 35.3l0 441.3c0 16.1 8.7 28.5 21.7 35.3L271.9 255.9 15.3 0zM440.5 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM72.9 499L353.7 337.8 293.6 277.7 72.9 499z"],"facebook-messenger":[512,512,"M256.6 8c-140 0-248.6 102.3-248.6 240.6 0 72.3 29.7 134.8 78.1 177.9 8.3 7.5 6.6 11.9 8 58.2 .1 3.2 1 6.4 2.6 9.2s3.9 5.2 6.7 6.9 5.9 2.8 9.1 3 6.5-.3 9.5-1.6C174.9 479 175.6 477.2 184.6 479.6 337.8 521.8 504 423.7 504 248.6 504 110.3 396.6 8 256.6 8zM405.8 193.1l-73 115.6c-2.8 4.3-6.4 8.1-10.6 11s-9.1 4.8-14.1 5.8-10.3 .8-15.3-.4-9.7-3.4-13.8-6.4l-58.1-43.5c-2.6-1.9-5.8-3-9-3s-6.4 1.1-9 3l-78.4 59.4c-10.5 7.9-24.2-4.6-17.1-15.7l73-115.6c2.8-4.3 6.4-8.1 10.6-11s9.1-4.8 14.1-5.8 10.3-.8 15.3 .4 9.7 3.4 13.9 6.4l58.1 43.5c2.6 1.9 5.8 3 9 3s6.4-1.1 9-3l78.4-59.4c10.4-8 24.1 4.5 17.1 15.6z"],"threads":[448,512,"M340.8 238c-.6-69.6-38.3-111.5-102-111.5-42.5 0-78.3 19.2-97.1 49.9l41.2 28.7c10.7-16.8 25.4-30.8 52.4-30.8 30.5 0 46.3 17 50.8 48.5-14.7-2.3-29.5-3.5-44.6-3.5-82.4 0-121.1 37.3-121.1 86.6s38.8 79.7 95.9 79.7c62.7 0 100.1-42.2 115.4-94.5 15.9 7.2 26.9 24 26.9 49.3 0 67.6-78 104.5-144.1 104.5-97.5 0-161.3-64-161.3-168.2 0-127.6 84.3-209.4 197.6-209.4 76 0 113.6 33.4 139.2 78.1L432 115.9c-27.8-58-89.9-99.5-183.1-99.5-148.5 0-249.5 105.4-249.5 258.2 0 139.8 98.9 220.9 216.7 220.9 97.4 0 195.8-56.8 195.8-154 0-50.8-29.2-84.5-71.2-103.5zM214.4 334.9c-21.5 0-40.4-10.2-40.4-29 0-29.6 36.4-38.6 72-38.6 13.5 0 26.8 .9 38.5 3.5-8.4 38.5-33.4 64.2-70 64.2l0 0z"],"pinterest":[512,512,"M504 256c0 137-111 248-248 248-25.6 0-50.2-3.9-73.4-11.1 10.1-16.5 25.2-43.5 30.8-65 3-11.6 15.4-59 15.4-59 8.1 15.4 31.7 28.5 56.8 28.5 74.8 0 128.7-68.8 128.7-154.3 0-81.9-66.9-143.2-152.9-143.2-107 0-163.9 71.8-163.9 150.1 0 36.4 19.4 81.7 50.3 96.1 4.7 2.2 7.2 1.2 8.3-3.3 .8-3.4 5-20.3 6.9-28.1 .6-2.5 .3-4.7-1.7-7.1-10.1-12.5-18.3-35.3-18.3-56.6 0-54.7 41.4-107.6 112-107.6 60.9 0 103.6 41.5 103.6 100.9 0 67.1-33.9 113.6-78 113.6-24.3 0-42.6-20.1-36.7-44.8 7-29.5 20.5-61.3 20.5-82.6 0-19-10.2-34.9-31.4-34.9-24.9 0-44.9 25.7-44.9 60.2 0 22 7.4 36.8 7.4 36.8s-24.5 103.8-29 123.2C161.5 437.2 163.5 467.4 165.6 487 73.4 450.9 8 361.1 8 256 8 119 119 8 256 8S504 119 504 256z"]};
    var NS = 'http://www.w3.org/2000/svg';
    function swap(el) {
        var name = null;
        for (var i = 0; i < el.classList.length; i++) {
            var cls = el.classList[i];
            if (cls !== 'fa-brands' && cls.indexOf('fa-') === 0 && ICONS[cls.slice(3)]) { name = cls.slice(3); break; }
        }
        if (!name || !el.parentNode) return;
        var icon = ICONS[name];
        var svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('class', 'svg-inline--fa ' + el.className);
        svg.setAttribute('viewBox', '0 0 ' + icon[0] + ' ' + icon[1]);
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        var path = document.createElementNS(NS, 'path');
        path.setAttribute('fill', 'currentColor');
        path.setAttribute('d', icon[2]);
        svg.appendChild(path);
        el.parentNode.replaceChild(svg, el);
    }
    function scan(root) {
        if (root.nodeType !== 1) return;
        if (root.matches && root.matches('i.fa-brands')) swap(root);
        else if (root.querySelectorAll) Array.prototype.forEach.call(root.querySelectorAll('i.fa-brands'), swap);
    }
    function start() {
        scan(document.documentElement);
        if (!('MutationObserver' in window)) return;
        new MutationObserver(function (changes) {
            changes.forEach(function (change) { Array.prototype.forEach.call(change.addedNodes, scan); });
        }).observe(document.body, { childList: true, subtree: true });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

/**
 * الهيدر والفوتر:
 * - زرار القائمة في الموبايل بيفتح ويقفل روابط الهيدر.
 * - مجموعات الفوتر في الموبايل بتفتح وتقفل (في الديسك توب مفتوحة دايمًا من الـ CSS).
 * - رابط له قايمة فرعية في الهيدر (زي "الوكلاء" ← "الوكلاء المعتمدون"): الضغط بيفتح القايمة ويقفلها،
 *   وبتتقفل لما تضغط براها أو تدوس Esc.
 * - المفضلة (القلب على أي كارت): الضغط بيخليها حمراء (aria-pressed) وضغطة تانية بترجّعها. الحالة بتتحفظ على المتصفح
 *   بالـ data-favorite-id، وبيتبعت حدث shary:favorite ({ id, active }) عشان الباك إند يحفظها في حساب العميل.
 *   قلب الهيدر (data-favorites-indicator) بيبقى أحمر وعليه العدد طول ما فيه حاجة في المفضلة، وبيفتح صفحة المفضلة.
 * - المشاركة (data-share-url): موبايل = قايمة شاري من تحت (واتساب أول اختيار برسالة الوحدة الجاهزة + "المزيد" لقايمة الموبايل) (واتساب/تيليجرام/فيسبوك/X/البريد/نسخ).
 *   ديسك توب = قايمة صغيرة جنب الزرار (واتساب / فيسبوك / X / تيليجرام / نسخ الرابط). حدث shary:share ({ url, title }) — ممكن تغيّر detail.url أو تمنعه.
 * - واتساب: أي لينك wa.me من غير نص بيتضاف له رسالة جاهزة (اسم الوحدة / المشروع + المكان + السعر + الكود + اللينك) من data-wa-text / data-wa-page — حدث shary:whatsapp ({ text }).
 * - الاتصال على الديسك توب / التابلت: لينك tel: بيفتح قايمة صغيرة (اتصل / واتساب / نسخ الرقم) بدل ما يتجاهله المتصفح.
 * - زرار الرجوع (window.SharyBack): أي حاجة بتتفتح فوق الصفحة (تصفية، لوحات الفلاتر، طلب الاجتماع، Shary AI، قايمة المشاركة)
 *   بتتسجل في تاريخ المتصفح، فزرار الرجوع (أو سحبة الرجوع في الموبايل) بيقفلها والعميل بيفضل في نفس الصفحة ونفس المكان بدل ما يخرج منها.
 * - المقارنة (data-compare-toggle + data-compare-id): بتظهر زرار المقارنة تحت (data-compare-bar) بعدد المختار، وبيفتح صفحة المقارنة. حدث shary:compare.
 */
(function () {
    // ---- زرار الرجوع بيقفل اللي مفتوح بدل ما يخرج من الصفحة
    // opened(close): بتتنادى لما لوحة تتفتح. closed(after): لما تتقفل من X / Esc / الضغط براها (after بتتنفذ بعد ما التاريخ يرجع خطوة).
    window.SharyBack = (function () {
        var open = [];        // دوال القفل للّوحات المفتوحة (الأحدث في الآخر)
        var skip = 0;         // رجوع إحنا اللي طلبناه (مش العميل)
        var busy = false;     // القفل جاي من زرار الرجوع
        var waiting = null;
        var timer = null;

        function done() {
            clearTimeout(timer);
            var after = waiting;
            waiting = null;
            if (after) after();
        }

        window.addEventListener('popstate', function () {
            if (skip) { skip--; done(); return; }
            var close = open.pop();
            if (!close) return;
            busy = true;
            try { close(); } finally { busy = false; }
        });

        return {
            opened: function (close) {
                open.push(close);
                try { history.pushState({ sharyOverlay: open.length }, ''); } catch (error) { /* التاريخ مش متاح: اللوحة بتشتغل عادي من غيره */ }
            },
            closed: function (after) {
                if (busy || !open.length) { if (after) after(); return; }
                open.pop();
                var state = null;
                try { state = history.state; } catch (error) { /* مش متاح */ }
                if (!state || !state.sharyOverlay) { if (after) after(); return; }
                skip++;
                waiting = after || null;
                timer = setTimeout(function () { skip = 0; done(); }, 500);
                history.back();
            }
        };
    })();

    // قايمة الموبايل: زرار القايمة بيفتحها صفحة كاملة، وبتتقفل من زرار الإغلاق [data-nav-close] أو Esc أو الضغط على أي رابط فيها
    document.querySelectorAll('[data-nav-toggle]').forEach(function (button) {
        var nav = document.getElementById(button.getAttribute('aria-controls'));
        if (!nav) return;
        function setMenu(open) {
            nav.classList.toggle('hidden', !open);
            button.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (open) { var scroll = nav.querySelector('.site-menu__scroll'); if (scroll) scroll.scrollTop = 0; }
        }
        button.addEventListener('click', function () { setMenu(nav.classList.contains('hidden')); });
        nav.addEventListener('click', function (event) {
            if (event.target.closest('[data-nav-close]') || event.target.closest('a')) setMenu(false);
        });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && !nav.classList.contains('hidden')) setMenu(false);
        });
    });

    document.querySelectorAll('[data-footer-toggle]').forEach(function (button) {
        button.addEventListener('click', function () {
            var list = button.nextElementSibling;
            if (!list) return;
            var isOpen = !list.classList.toggle('hidden');
            list.classList.toggle('flex', isOpen);
            button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    });
    var dropdowns = Array.prototype.slice.call(document.querySelectorAll('[data-nav-dropdown]'));

    function setDropdown(dropdown, open) {
        var toggle = dropdown.querySelector('[data-nav-dropdown-toggle]');
        var menu = dropdown.querySelector('[data-nav-dropdown-menu]');
        if (!toggle || !menu) return;
        menu.classList.toggle('hidden', !open);
        menu.classList.toggle('flex', open && menu.classList.contains('flex-col'));
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        var arrow = toggle.querySelector('[data-nav-dropdown-arrow]');
        if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : '';
    }

    dropdowns.forEach(function (dropdown) {
        var toggle = dropdown.querySelector('[data-nav-dropdown-toggle]');
        if (!toggle) return;
        toggle.addEventListener('click', function () {
            var open = toggle.getAttribute('aria-expanded') !== 'true';
            dropdowns.forEach(function (other) { setDropdown(other, other === dropdown && open); });
        });
        dropdown.querySelectorAll('[data-nav-dropdown-menu] a').forEach(function (link) {
            link.addEventListener('click', function () { setDropdown(dropdown, false); });
        });
    });

    document.addEventListener('click', function (event) {
        dropdowns.forEach(function (dropdown) {
            if (!dropdown.contains(event.target)) setDropdown(dropdown, false);
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') dropdowns.forEach(function (dropdown) { setDropdown(dropdown, false); });
    });
    // ---- رسالة صغيرة تحت الشاشة (مثلاً: "تم نسخ الرابط")
    var toastNode = null;
    var toastTimer = null;
    function toast(text) {
        if (!toastNode) {
            toastNode = document.createElement('div');
            toastNode.setAttribute('role', 'status');
            toastNode.className = 'shary-toast';
            document.body.appendChild(toastNode);
        }
        toastNode.textContent = text;
        toastNode.classList.add('is-shown');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastNode.classList.remove('is-shown'); }, 2600);
    }
    function english(node) {
        var holder = node.closest('[lang]');
        return ((holder && holder.lang) || document.documentElement.lang || 'ar').indexOf('en') === 0;
    }

    // ---- المفضلة: القلب على الكارت بيبقى أحمر، وقلب الهيدر بيبقى أحمر وعليه العدد طول ما فيه حاجة في المفضلة
    var favoriteKey = 'shary-favorites';
    var memory = [];

    function readFavorites() {
        try { return JSON.parse(window.localStorage.getItem(favoriteKey)) || []; } catch (error) { return memory; }
    }

    function writeFavorites(list) {
        memory = list;
        try { window.localStorage.setItem(favoriteKey, JSON.stringify(list)); } catch (error) { /* التخزين مش متاح: الحالة بتفضل على الصفحة بس */ }
    }

    function showFavorites() {
        var saved = readFavorites();
        var total = saved.length;   // العدد = المحفوظ فعلًا (نفس العنصر ممكن يبقى له أكتر من قلب في الصفحة)
        document.querySelectorAll('[data-favorites-indicator]').forEach(function (indicator) {
            indicator.setAttribute('data-active', total > 0 ? 'true' : 'false');
            // لينك صفحة المفضلة: المحفوظ على الجهاز بيتبعت في اللينك (?ids=units/a,projects/b) — العميل المسجل: المفضلة من حسابه على السيرفر
            var base = indicator.getAttribute('data-base') || '';
            if (base && base !== '#') indicator.setAttribute('href', base + (saved.length ? (base.indexOf('?') === -1 ? '?' : '&') + 'ids=' + saved.join(',') : ''));
            var badge = indicator.querySelector('[data-favorites-count]');
            if (badge) { badge.textContent = total; badge.classList.toggle('hidden', total === 0); }
        });
    }

    // الضغطات كلها بتتسمع من الصفحة نفسها، فالكروت اللي بتتضاف بعدين (التحميل وأنت نازل) زرايرها بتشتغل زي الباقي
    function closest(event, selector) { return event.target.closest ? event.target.closest(selector) : null; }

    // بتعلّم القلوب المحفوظة جوه جزء من الصفحة (بتتنادى للكروت الجديدة: window.SharyCards.refresh(root))
    function markFavorites(root) {
        var saved = readFavorites();
        (root || document).querySelectorAll('[data-favorite-toggle]').forEach(function (button) {
            var id = button.getAttribute('data-favorite-id');
            if (id && saved.indexOf(id) !== -1) button.setAttribute('aria-pressed', 'true');
        });
        showFavorites();
    }
    window.SharyCards = { refresh: function (root) { markFavorites(root); markCompare(root); } };

    document.addEventListener('click', function (event) {
        var button = closest(event, '[data-favorite-toggle]');
        if (!button) return;
        var id = button.getAttribute('data-favorite-id');
        var active = button.getAttribute('aria-pressed') !== 'true';
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
        if (id) {
            var list = readFavorites().filter(function (item) { return item !== id; });
            if (active) list.push(id);
            writeFavorites(list);
        }
        showFavorites();
        button.dispatchEvent(new CustomEvent('shary:favorite', { bubbles: true, detail: { id: id, active: active } }));
    }, true);   // capture: الزرار بيشتغل حتى لو الكارت اللي حواليه بيوقّف الضغطة (stopPropagation)
    markFavorites(document);

    // ---- المشاركة
    // موبايل: قايمة شاري بتطلع من تحت (واتساب / تيليجرام / فيسبوك / X / البريد / نسخ الرابط) وآخرها "المزيد" بيفتح قايمة الموبايل نفسه.
    // ديسك توب: قايمة صغيرة جنب زرار المشاركة (واتساب / فيسبوك / منصة إكس / تيليجرام / نسخ الرابط).
    // حدث shary:share ({ url, title }): أي كود ممكن يغيّر detail.url / detail.title، أو يستلم المشاركة مكاننا بـ preventDefault().
    var nativeShareBlocked = false;
    var shareSheet = null;

    function copyText(text, done, failed) {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, failed);
        else failed();
    }

    // ---- قايمة صغيرة جنب الزرار (ديسك توب): items = [[كلاس الأيقونة, أيقونة, الاسم, اللينك أو دالة], ...]
    var floatMenu = null;
    function closeMenu() {
        if (!floatMenu) return;
        floatMenu.parentNode.removeChild(floatMenu);
        floatMenu = null;
    }
    document.addEventListener('click', function (event) { if (floatMenu && !floatMenu.contains(event.target)) closeMenu(); }, true);
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('scroll', closeMenu, { passive: true });
    window.addEventListener('resize', closeMenu);

    function openMenu(anchor, items, en, heading) {
        closeMenu();
        var menu = document.createElement('div');
        menu.className = 'shary-menu';
        menu.setAttribute('role', 'menu');
        menu.dir = en ? 'ltr' : 'rtl';
        if (heading) {
            var head = document.createElement('p');
            head.className = 'shary-menu__head';
            head.textContent = heading;
            menu.appendChild(head);
        }
        items.forEach(function (item) {
            var action = typeof item[3] === 'function';
            var row = document.createElement(action ? 'button' : 'a');
            row.className = 'shary-menu__item';
            row.setAttribute('role', 'menuitem');
            if (action) row.type = 'button';
            else { row.href = item[3]; if (item[3].indexOf('tel:') !== 0) { row.target = '_blank'; row.rel = 'noopener'; } row.setAttribute('data-menu-link', ''); }
            row.innerHTML = '<span class="shary-share__icon ' + item[0] + '">' + item[1] + '</span><span></span>';
            row.lastChild.textContent = item[2];
            row.addEventListener('click', function () { if (action) item[3](row); else setTimeout(closeMenu, 0); });
            menu.appendChild(row);
        });
        document.body.appendChild(menu);
        // مكان القايمة: تحت الزرار (أو فوقه لو مفيش مكان) وجوه حدود الشاشة
        var box = anchor.getBoundingClientRect();
        var width = menu.offsetWidth, height = menu.offsetHeight;
        var left = Math.min(Math.max(8, box.left + box.width / 2 - width / 2), window.innerWidth - width - 8);
        var top = box.bottom + 8;
        if (top + height > window.innerHeight - 8) top = Math.max(8, box.top - height - 8);
        menu.style.left = left + 'px';
        menu.style.top = top + 'px';
        floatMenu = menu;
    }

    var ICON_LINK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.400-6.400l-1 1"/><path d="M14 10a4.500 4.500 0 0 0-6.400 0l-3 3a4.500 4.500 0 0 0 6.400 6.400l1-1"/></svg>';
    var ICON_PHONE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.800a15.100 15.100 0 0 0 6.600 6.600l2.200-2.200a1 1 0 0 1 1-.250 11.400 11.400 0 0 0 3.600.570 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.500a1 1 0 0 1 1 1c0 1.250.200 2.450.570 3.570a1 1 0 0 1-.250 1L6.600 10.800Z"/></svg>';

    function openShareMenu(button, url, title, en) {
        var u = encodeURIComponent(url), t = encodeURIComponent(title);
        openMenu(button, [
            ['shary-share__icon--whatsapp', '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>', en ? 'WhatsApp' : 'واتساب', 'https://wa.me/?text=' + encodeURIComponent(shareMessage(button, url, title))],
            ['shary-share__icon--facebook', '<i class="fa-brands fa-facebook-f" aria-hidden="true"></i>', en ? 'Facebook' : 'فيسبوك', 'https://www.facebook.com/sharer/sharer.php?u=' + u],
            ['shary-share__icon--x', '<i class="fa-brands fa-x-twitter" aria-hidden="true"></i>', en ? 'X' : 'منصة إكس', 'https://twitter.com/intent/tweet?url=' + u + '&text=' + t],
            ['shary-share__icon--telegram', '<i class="fa-brands fa-telegram" aria-hidden="true"></i>', en ? 'Telegram' : 'تيليجرام', 'https://t.me/share/url?url=' + u + '&text=' + t],
            ['shary-share__icon--more', ICON_LINK, en ? 'Copy link' : 'نسخ الرابط', function (row) {
                copyText(url, function () { row.lastChild.textContent = en ? 'Link copied' : 'تم نسخ الرابط'; setTimeout(closeMenu, 900); }, function () { toast(url); closeMenu(); });
            }]
        ], en, en ? 'Share' : 'مشاركة');
    }

    function closeShareSheet() {
        if (!shareSheet || !shareSheet.classList.contains('is-open')) return;
        shareSheet.classList.remove('is-open');
        window.SharyBack.closed();
    }

    function openShareSheet(url, title, en, button) {
        if (!shareSheet) {
            shareSheet = document.createElement('div');
            shareSheet.className = 'shary-share';
            shareSheet.setAttribute('role', 'dialog');
            shareSheet.setAttribute('aria-modal', 'true');
            shareSheet.innerHTML =
                '<div class="shary-share__dim" data-share-close></div>' +
                '<div class="shary-share__panel">' +
                    '<span class="shary-share__grip" aria-hidden="true"></span>' +
                    '<div class="shary-share__head"><h3 data-share-heading></h3>' +
                        '<button type="button" class="shary-share__close" data-share-close><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
                    // لوجو شاري في دايرة صغيرة قدام اسم العنصر ولينكه ، وقصادهم زرار "نسخ"
                    '<div class="shary-share__link"><i class="shary-share__logo" aria-hidden="true">' +
                        '<svg width="26" height="22" viewBox="0 0 44 36"><circle cx="13" cy="23" r="11" fill="#FCB424"/><circle cx="31" cy="23" r="11" fill="#4CBFB2"/><circle cx="22" cy="12" r="11" fill="#1F4466"/></svg></i>' +
                        '<div><strong data-share-name></strong><span dir="ltr" data-share-link></span></div>' +
                        '<button type="button" data-share-copy></button></div>' +
                    '<div class="shary-share__grid" data-share-targets></div>' +
                '</div>';
            document.body.appendChild(shareSheet);
            shareSheet.addEventListener('click', function (event) {
                if (event.target.closest('[data-share-close]') || event.target.closest('a[data-share-target]')) closeShareSheet();
            });
            document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeShareSheet(); });
        }

        var u = encodeURIComponent(url);
        var t = encodeURIComponent(title);
        // واتساب: رسالة المشاركة الكاملة (بيانات الوحدة / المشروع + اللينك + لينك الصورة) — من الكارت أو من صفحة العنصر نفسها
        var waText = shareMessage(button, url, title);
        var targets = [
            ['shary-share__icon--whatsapp', 'fa-brands fa-whatsapp', en ? 'WhatsApp' : 'واتساب', 'https://wa.me/?text=' + encodeURIComponent(waText)],
            ['shary-share__icon--telegram', 'fa-brands fa-telegram', en ? 'Telegram' : 'تيليجرام', 'https://t.me/share/url?url=' + u + '&text=' + t],
            ['shary-share__icon--facebook', 'fa-brands fa-facebook-f', en ? 'Facebook' : 'فيسبوك', 'https://www.facebook.com/sharer/sharer.php?u=' + u],
            ['shary-share__icon--x', 'fa-brands fa-x-twitter', 'X', 'https://twitter.com/intent/tweet?url=' + u + '&text=' + t],
            ['shary-share__icon--mail', '', en ? 'Email' : 'البريد', 'mailto:?subject=' + t + '&body=' + u]
        ];

        shareSheet.dir = en ? 'ltr' : 'rtl';
        shareSheet.lang = en ? 'en' : 'ar';
        shareSheet.setAttribute('aria-label', en ? 'Share' : 'مشاركة');
        shareSheet.querySelector('[data-share-heading]').textContent = en ? 'Share' : 'مشاركة';
        shareSheet.querySelectorAll('[data-share-close]')[1].setAttribute('aria-label', en ? 'Close' : 'إغلاق');
        shareSheet.querySelector('[data-share-name]').textContent = title;
        var shown = url;
        try { shown = decodeURI(url); } catch (error) { /* لينك فيه ترميز غير سليم: بيتعرض زي ما هو */ }
        shareSheet.querySelector('[data-share-link]').textContent = shown.replace(/^https?:\/\//, '');

        var copyButton = shareSheet.querySelector('[data-share-copy]');
        copyButton.textContent = en ? 'Copy' : 'نسخ';
        copyButton.classList.remove('is-done');
        copyButton.onclick = function () {
            copyText(url, function () {
                copyButton.textContent = en ? 'Copied' : 'تم النسخ';
                copyButton.classList.add('is-done');
            }, function () { toast(url); });
        };

        var grid = shareSheet.querySelector('[data-share-targets]');
        grid.innerHTML = '';
        targets.forEach(function (target) {
            var link = document.createElement('a');
            link.href = target[3];
            link.target = '_blank';
            link.rel = 'noopener';
            link.setAttribute('data-share-target', target[2]);
            var icon = target[1] ? '<i class="' + target[1] + '" aria-hidden="true"></i>' : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7.5 8 6 8-6"/></svg>';
            link.innerHTML = '<span class="shary-share__icon ' + target[0] + '">' + icon + '</span><span></span>';
            link.lastChild.textContent = target[2];
            grid.appendChild(link);
        });
        // "المزيد": قايمة الموبايل نفسه، لو متاحة
        if (navigator.share && !nativeShareBlocked) {
            var more = document.createElement('button');
            more.type = 'button';
            more.innerHTML = '<span class="shary-share__icon shary-share__icon--more"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg></span><span></span>';
            more.lastChild.textContent = en ? 'More' : 'المزيد';
            more.addEventListener('click', function () {
                // قايمة الموبايل: نفس الرسالة الكاملة (اللينك جواها) — ولو مفيش بيانات: العنوان + اللينك
                navigator.share(waText.indexOf(url) > -1 ? { title: title, text: waText } : { title: title, text: title, url: url }).then(closeShareSheet, function (error) {
                    if (!error || error.name !== 'AbortError') { nativeShareBlocked = true; more.remove(); }
                });
            });
            grid.appendChild(more);
        }

        if (!shareSheet.classList.contains('is-open')) {
            shareSheet.classList.add('is-open');
            window.SharyBack.opened(function () { shareSheet.classList.remove('is-open'); });
        }
    }

    document.addEventListener('click', function (event) {
        var button = closest(event, '[data-share-url]');
        if (!button) return;
        (function () {
            var detail = {
                url: new URL(button.getAttribute('data-share-url'), location.href).href,
                title: button.getAttribute('data-share-title') || document.title
            };
            if (!button.dispatchEvent(new CustomEvent('shary:share', { bubbles: true, cancelable: true, detail: detail }))) return;
            var url = detail.url;
            var title = detail.title;
            var en = english(button);
            var phone = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

            // ديسك توب: قايمة صغيرة جنب الزرار. موبايل: قايمة شاري من تحت (واتساب أول اختيار ، تيليجرام ، فيسبوك ، X ، البريد ، نسخ الرابط)
            // وآخرها "المزيد" بيفتح قايمة المشاركة بتاعة الموبايل نفسه.
            if (!phone) { event.stopPropagation(); openShareMenu(button, url, title, en); return; }
            openShareSheet(url, title, en, button);
        })();
    }, true);

    // ---- واتساب: رسالة جاهزة فيها بيانات الوحدة / المشروع وكوده ولينكه (واتساب بيعرض اللينك بصورة الصفحة og:image)
    // النص من أقرب عنصر عليه data-wa-text (كارت) ، وإلا من data-wa-page اللي على صفحة الوحدة / المشروع (لأي زرار واتساب في الصفحة) ،
    // وإلا رسالة عامة باسم الصفحة. اللينك من data-wa-url. حدث shary:whatsapp ({ text }) — غيّروا detail.text أو امنعوه.
    function whatsappText(link, shareUrl) {
        var en = english(link);
        var holder = link.closest('[data-wa-text]');
        var scope = link.closest('main') || document;
        var page = holder ? null : (link.closest('[data-wa-page]') || scope.querySelector('[data-wa-page]'));
        var source = holder || page;
        var absolute = function (value, web) {
            try { var full = new URL(value, location.href).href; return (web ? /^https?:/ : /^(?!data:|javascript:|blob:)/).test(full) ? full : ''; } catch (error) { return ''; }
        };
        if (!source) return (en ? 'Hello Shary, I would like to ask about:' : 'مرحبًا شاري، أريد الاستفسار عن:') + '\n' + document.title + '\n' + location.href;
        // نفس ترتيب رسالة الموقع: البيانات ، سطر اللينك ، سطر فاضي ، لينك الصورة
        var text = (source.getAttribute(holder ? 'data-wa-text' : 'data-wa-page') || '').replace(/^\s+|\s+$/g, '');
        var url = shareUrl || absolute(source.getAttribute('data-wa-url') || '') || location.href;
        var photo = holder ? holder.querySelector('img.card-photo') : null;   // الكارت: صورته نفسها
        var image = absolute(source.getAttribute('data-wa-image') || (photo ? photo.currentSrc || photo.getAttribute('src') : '') || '', true);
        return text + ' ' + url + (image ? '\n\n' + image : '');
    }

    // رسالة المشاركة (زرار المشاركة على الكارت أو جوه صفحة الوحدة / المشروع) — نفس شكل رسالة الموقع:
    //   بيانات الوحدة / المشروع (الاسم ، المرجع ، المشروع / المطور ، السعر ، المنطقة) ← "رابط الوحدة: اللينك" ← سطر فاضي ← لينك الصورة.
    //   واتساب بيعرض فوقها معاينة اللينك (الصورة + العنوان + الوصف) من og:image / og:title / og:description بتوع صفحة الوحدة / المشروع.
    //   لو الزرار مش على كارت ولا في صفحة فيها بيانات: العنوان + اللينك. حدث shary:whatsapp ({ text }) بيتبعت هنا كمان.
    function shareMessage(button, url, title) {
        var page = button && button.closest ? button.closest('[data-wa-page]') : null;
        var has = button && button.closest && (button.closest('[data-wa-text]') || (page && !button.closest('[data-card], [data-unit], [data-project], article')));
        var detail = { text: has ? whatsappText(button, url) : title + '\n' + url };
        if (button && button.dispatchEvent) button.dispatchEvent(new CustomEvent('shary:whatsapp', { bubbles: true, cancelable: true, detail: detail }));
        return detail.text;
    }

    function whatsappHref(link) {
        var href = link.getAttribute('href') || '';
        if (/[?&]text=/.test(href)) return href;
        var detail = { text: whatsappText(link) };
        if (!link.dispatchEvent(new CustomEvent('shary:whatsapp', { bubbles: true, cancelable: true, detail: detail }))) return href;
        return href + (href.indexOf('?') === -1 ? '?' : '&') + 'text=' + encodeURIComponent(detail.text);
    }

    document.addEventListener('click', function (event) {
        var link = closest(event, 'a[href*="wa.me/"], a[href*="api.whatsapp.com/send"]');
        if (!link || link.hasAttribute('data-share-target') || link.hasAttribute('data-menu-link')) return;
        link.setAttribute('href', whatsappHref(link));   // قبل ما المتصفح يفتح اللينك
    }, true);

    // ---- الاتصال على الديسك توب / التابلت: قايمة صغيرة (اتصل / واتساب / نسخ الرقم) — على الموبايل لينك tel: بيفتح الاتصال عادي
    document.addEventListener('click', function (event) {
        var link = closest(event, 'a[href^="tel:"]');
        if (!link || link.hasAttribute('data-menu-link')) return;
        var touchPhone = window.matchMedia && window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 768;
        if (touchPhone) return;
        event.preventDefault();
        event.stopPropagation();
        var en = english(link);
        var number = (link.getAttribute('href') || '').slice(4);
        var scope = link.closest('main') || document;
        var near = (link.parentNode && link.parentNode.querySelector('a[href*="wa.me/"]')) || scope.querySelector('a[href*="wa.me/"]') || document.querySelector('a[href*="wa.me/"]');
        var items = [['shary-share__icon--mail', ICON_PHONE, (en ? 'Call ' : 'اتصل ') + '\u2066' + number + '\u2069', 'tel:' + number]];
        if (near) items.push(['shary-share__icon--whatsapp', '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>', en ? 'WhatsApp' : 'واتساب', whatsappHref(near)]);
        items.push(['shary-share__icon--more', ICON_LINK, en ? 'Copy number' : 'نسخ الرقم', function (row) {
            copyText(number, function () { row.lastChild.textContent = en ? 'Number copied' : 'تم نسخ الرقم'; setTimeout(closeMenu, 900); }, function () { toast(number); closeMenu(); });
        }]);
        openMenu(link, items, en, en ? 'Contact us' : 'تواصل معنا');
    });

    // ---- المقارنة: الضغط على "قارن" بيعلّم الوحدة / المشروع وبيحفظه على الجهاز (shary-compare: units/slug ، projects/slug)،
    // وبيظهر زرار المقارنة تحت بالعدد — الضغط عليه بيفتح صفحة المقارنة: ?units=a,b&projects=c,d . أقصى عدد 4 وحدات و4 مشاريع.
    // نوع العنصر: data-compare-type="unit | project" على الزرار (ولو مش مكتوب: الكارت اللي جوه [data-unit] وحدة، وغيره مشروع).
    var compareKey = 'shary-compare';
    var compareMemory = [];
    var compareMax = 4;

    function readCompare() {
        try { return JSON.parse(window.localStorage.getItem(compareKey)) || []; } catch (error) { return compareMemory; }
    }

    function writeCompare(list) {
        compareMemory = list;
        try { window.localStorage.setItem(compareKey, JSON.stringify(list)); } catch (error) { /* التخزين مش متاح: الحالة بتفضل على الصفحة بس */ }
    }

    function compareId(button) {
        var slug = button.getAttribute('data-compare-id') || '';
        if (slug.indexOf('/') !== -1) return slug;
        var type = button.getAttribute('data-compare-type') || (button.closest('[data-unit]') ? 'unit' : 'project');
        return (type === 'unit' ? 'units/' : 'projects/') + slug;
    }

    function compareQuery(list) {
        var parts = [];
        ['units', 'projects'].forEach(function (group) {
            var slugs = list.filter(function (id) { return id.indexOf(group + '/') === 0; }).map(function (id) { return id.slice(group.length + 1); });
            if (slugs.length) parts.push(group + '=' + slugs.join(','));
        });
        return parts.join('&');
    }

    function showCompare() {
        var list = readCompare();
        var query = compareQuery(list);
        document.querySelectorAll('[data-compare-bar], [data-compare-link]').forEach(function (link) {
            if (link.hasAttribute('data-compare-bar')) {
                link.classList.toggle('hidden', list.length === 0);
                link.classList.toggle('flex', list.length > 0);
            }
            var count = link.querySelector('[data-compare-count]');
            if (count) { count.textContent = list.length; if (!link.hasAttribute('data-compare-bar')) count.classList.toggle('hidden', list.length === 0); }
            var base = link.getAttribute('data-base') || '';
            if (base && base !== '#') link.setAttribute('href', base + (query ? (base.indexOf('?') === -1 ? '?' : '&') + query : ''));
        });
        return list;
    }

    // بتعلّم أزرار "قارن" المحفوظة جوه جزء من الصفحة (والكروت الجديدة: window.SharyCards.refresh(root))
    function markCompare(root) {
        var list = readCompare();
        (root || document).querySelectorAll('[data-compare-toggle]').forEach(function (button) {
            button.setAttribute('aria-pressed', list.indexOf(compareId(button)) !== -1 ? 'true' : 'false');
        });
        showCompare();
    }
    window.SharyCompare = { read: readCompare, write: function (list) { writeCompare(list); markCompare(document); } };

    document.addEventListener('click', function (event) {
        var button = closest(event, '[data-compare-toggle]');
        if (!button) return;
        var id = compareId(button);
        var active = button.getAttribute('aria-pressed') !== 'true';
        var list = readCompare().filter(function (item) { return item !== id; });
        if (active) {
            var group = id.split('/')[0];
            if (list.filter(function (item) { return item.indexOf(group + '/') === 0; }).length >= compareMax) {   // العدد كامل: رسالة ومفيش إضافة
                toast(english(button) ? 'You can compare up to ' + compareMax + ' at a time' : 'أقصى عدد للمقارنة ' + compareMax + ' في المرة');
                return;
            }
            list.push(id);
        }
        writeCompare(list);
        markCompare(document);
        button.dispatchEvent(new CustomEvent('shary:compare', { bubbles: true, detail: { id: id, active: active, ids: list } }));
    }, true);
    markCompare(document);

    // X جنب زرار المقارنة العايم [data-compare-dismiss]: بيفضّي المقارنة والزرار بيختفي. الحدث shary:compare-clear ({ ids }) عشان السيرفر يتحدّث
    document.addEventListener('click', function (event) {
        var dismiss = closest(event, '[data-compare-dismiss]');
        if (!dismiss) return;
        var ids = readCompare();
        writeCompare([]);
        markCompare(document);
        dismiss.dispatchEvent(new CustomEvent('shary:compare-clear', { bubbles: true, detail: { ids: ids } }));
    });
    // ---------- نص بيتقصّر ويتفرد [data-collapsible] ("عن المطور" ، "عن الإيجار" ، "عن الوحدة") ----------
    // النص مفتوح في الأول. الزرار [data-collapsible-toggle] اللي جنبه بيقصّره (is-collapsed) ويفرده، ونصه بيتبدّل بين data-less و data-more.
    document.querySelectorAll('[data-collapsible]').forEach(function (box) {
        var toggle = box.parentNode.querySelector('[data-collapsible-toggle]');
        if (!toggle) return;
        toggle.addEventListener('click', function () {
            var collapse = !box.classList.contains('is-collapsed');
            box.classList.toggle('is-collapsed', collapse);
            toggle.setAttribute('aria-expanded', collapse ? 'false' : 'true');
            var label = toggle.querySelector('[data-label]');
            (label || toggle).textContent = toggle.getAttribute(collapse ? 'data-more' : 'data-less');
            if (collapse) box.scrollIntoView({ block: 'nearest' });
        });
    });

    // ---- عنصر ثابت تحت الهيدر [data-stick-under-header] (فورم الاستشارة في صفحة المقال على الديسك توب):
    // الـ CSS بيثبته (lg:sticky) والسكربت بيظبط المسافة من فوق على ارتفاع الهيدر الفعلي + 16px.
    document.querySelectorAll('[data-stick-under-header]').forEach(function (box) {
        var scope = box.closest('[lang]') || document;
        var waiting = false;
        function place() {
            waiting = false;
            if (!box.offsetHeight) return;   // الصفحة مخفية دلوقتي
            var header = scope.querySelector('header');
            var base = header ? (parseFloat(window.getComputedStyle(header).top) || 0) + header.offsetHeight : 0;
            box.style.top = (base + 16) + 'px';
        }
        window.addEventListener('resize', place);
        window.addEventListener('scroll', function () { if (!waiting) { waiting = true; window.requestAnimationFrame(place); } }, { passive: true });
        place();
    });

    // ---- صف كروت بيتحرك لوحده [data-auto-rail] (المشروعات الجديدة في صفحة المنطقة وصفحة المشروع):
    // موبايل وتابلت بس: الصف بيتحرك بالراحة كارت كارت (كل 3.5 ثانية) ولما يوصل للآخر بيرجع للأول. ديسك توب: مش بيتحرك لوحده.
    // بيقف طول ما العميل ماسكه، ولو مش ظاهر على الشاشة، ولو الجهاز مطفّي الحركة.
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        var railNarrow = window.matchMedia('(max-width: 1023px)');
        document.querySelectorAll('[data-auto-rail]').forEach(function (rail) {
            // العناصر بتتقري كل مرة (الصف ممكن محتواه يتغيّر) ، والمدة من data-auto-rail="بالمللي ثانية" (الافتراضي 3500)
            var at = 0, held = false, seen = false, resume = null;
            function hold() { held = true; if (resume) { clearTimeout(resume); resume = null; } }
            function release(wait) { if (resume) clearTimeout(resume); resume = setTimeout(function () { held = false; resume = null; }, wait); }
            rail.addEventListener('touchstart', hold, { passive: true });
            rail.addEventListener('touchend', function () { release(5000); }, { passive: true });
            rail.addEventListener('focusin', hold);
            rail.addEventListener('focusout', function () { release(0); });
            if ('IntersectionObserver' in window) new IntersectionObserver(function (entries) { seen = entries[0].isIntersecting; }, { threshold: 0.6 }).observe(rail);
            else seen = true;
            function offset(card) {   // المسافة بين أول الكارت وأول الصف (حسب اتجاه الصفحة)
                var box = rail.getBoundingClientRect(), r = card.getBoundingClientRect();
                var style = window.getComputedStyle(rail);
                var rtl = style.direction === 'rtl';
                var pad = parseFloat(rtl ? style.paddingRight : style.paddingLeft) || 0;
                return rtl ? r.right - (box.right - pad) : r.left - (box.left + pad);
            }
            window.setInterval(function () {
                if (!railNarrow.matches || held || !seen || document.hidden || !rail.offsetWidth) return;
                var cards = Array.prototype.slice.call(rail.children);
                if (cards.length < 2 || rail.scrollWidth - rail.clientWidth < 4) return;   // كله ظاهر: مفيش حاجة تتحرك
                at = (at + 1) % cards.length;
                var room = rail.scrollWidth - rail.clientWidth - Math.abs(rail.scrollLeft);
                if (at === 0 || room < 2) { at = 0; rail.scrollTo({ left: 0, behavior: 'smooth' }); return; }
                rail.scrollTo({ left: rail.scrollLeft + offset(cards[at]), behavior: 'smooth' });
            }, Number(rail.getAttribute('data-auto-rail')) || 3500);
        });
    }

    // ---- شريط الإعلانات [data-ad-strip] (partials/ad-strip.blade.php): إعلان واحد ظاهر في البوكس، بيتسحب بالجنب وبيتبدّل لوحده كل 5 ثواني ----------
    document.querySelectorAll('[data-ad-strip]').forEach(function (strip) {
        var track = strip.querySelector('[data-ad-track]');
        var slides = track ? Array.prototype.slice.call(track.children) : [];
        var dots = Array.prototype.slice.call(strip.querySelectorAll('[data-ad-dots] button'));
        if (slides.length < 2) return;
        var at = 0;
        var seen = false;
        var held = false;

        function go(index, smooth) {
            at = (index + slides.length) % slides.length;
            var left = track.scrollLeft + slides[at].getBoundingClientRect().left - track.getBoundingClientRect().left;
            track.scrollTo({ left: left, behavior: smooth === false ? 'auto' : 'smooth' });
        }
        function mark() {
            var box = track.getBoundingClientRect();
            var best = 0, gap = Infinity;
            slides.forEach(function (slide, i) {
                var d = Math.abs(slide.getBoundingClientRect().left - box.left);
                if (d < gap) { gap = d; best = i; }
            });
            at = best;
            dots.forEach(function (dot, i) { dot.setAttribute('aria-current', i === at ? 'true' : 'false'); });
        }

        track.addEventListener('scroll', function () { window.requestAnimationFrame(mark); }, { passive: true });
        dots.forEach(function (dot, i) { dot.addEventListener('click', function () { go(i); }); });
        ['mouseenter', 'touchstart', 'focusin'].forEach(function (name) { strip.addEventListener(name, function () { held = true; }, { passive: true }); });
        ['mouseleave', 'touchend', 'focusout'].forEach(function (name) { strip.addEventListener(name, function () { held = false; }, { passive: true }); });
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) { seen = entries[0].isIntersecting; }, { threshold: 0.6 }).observe(strip);
        } else {
            seen = true;
        }
        // بيتبدّل لوحده بس والشريط ظاهر على الشاشة والعميل مش واقف عليه
        window.setInterval(function () { if (seen && !held && !document.hidden) go(at + 1); }, 5000);
    });
})();

/**
 * زرار التطبيق في الهيدر [data-app-button]:
 * - الافتراضي "حمل التطبيق" (data-state="get") واللينك بيبقى المتجر المناسب للجهاز: data-ios-url على آيفون/آيباد ، data-android-url على الباقي.
 * - لو التطبيق متسطّب بيتحوّل لـ "افتح التطبيق" (data-state="open") واللينك بيبقى data-open-url. بنعرف إنه متسطّب من:
 *   1) أندرويد (كروم): navigator.getInstalledRelatedApps() — محتاج related_applications في manifest الموقع + assetlinks.json في التطبيق.
 *   2) الصفحة مفتوحة من جوه التطبيق نفسه (User-Agent فيه SharyApp) أو اللينك جاي من التطبيق (?from=app) — وبيتحفظ على الجهاز.
 *   آيفون (سفاري): المتصفح مش بيسمح للموقع يعرف التطبيقات المتسطّبة — عشان كده data-open-url لازم يبقى Universal Link (بيفتح التطبيق لو موجود).
 * - حدث shary:app-state ({ installed }) على الزرار بعد ما الحالة تتحدد.
 */
(function () {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-app-button]'));
    if (!buttons.length) return;
    var ua = navigator.userAgent || '';
    var ios = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
    var KEY = 'shary-app-installed';

    function remembered() { try { return window.localStorage.getItem(KEY) === '1'; } catch (error) { return false; } }
    function remember() { try { window.localStorage.setItem(KEY, '1'); } catch (error) { /* التخزين مقفول */ } }

    function apply(installed) {
        buttons.forEach(function (button) {
            var label = button.querySelector('[data-app-label]');
            var store = button.getAttribute(ios ? 'data-ios-url' : 'data-android-url');
            var open = button.getAttribute('data-open-url');
            button.setAttribute('data-state', installed ? 'open' : 'get');
            if (label) label.textContent = button.getAttribute(installed ? 'data-label-open' : 'data-label-get') || label.textContent;
            if (installed && open && open !== '#') { button.setAttribute('href', open); button.removeAttribute('target'); }
            else if (!installed && store) { button.setAttribute('href', store); button.setAttribute('target', '_blank'); button.setAttribute('rel', 'noopener'); }
            button.dispatchEvent(new CustomEvent('shary:app-state', { bubbles: true, detail: { installed: installed } }));
        });
    }

    var fromApp = /SharyApp/i.test(ua) || /[?&]from=app(&|$)/.test(window.location.search);
    if (fromApp) remember();
    apply(fromApp || remembered());

    if (navigator.getInstalledRelatedApps) {
        navigator.getInstalledRelatedApps().then(function (apps) {
            var id = buttons[0].getAttribute('data-android-package');
            var found = (apps || []).some(function (app) { return !id || app.id === id; });
            if (found) { remember(); apply(true); }
        }).catch(function () { /* المتصفح مش بيدعمها */ });
    }
})();

/**
 * بوب أب تحميل التطبيق [data-app-popup] (موبايل بس): بيظهر بعد data-delay من فتح الصفحة وبيدخل من الشمال.
 * - بيظهر أول ما العميل يفتح الموقع (مرة في الزيارة الواحدة — sessionStorage) ، ومش بيظهر لو التطبيق متسطّب (زرار التطبيق data-state="open").
 *   عايزينه أقل؟ غيّروا DAYS لعدد الأيام (بيتحفظ في localStorage بدل الزيارة).
 * - القفل: × أو الضغط براه أو Esc أو الضغط على زرار التحميل. window.SharyAppPopup.open() / .close() للتحكم من أي كود.
 * - حدث shary:app-popup ({ open }) على العنصر.
 */
(function () {
    var pop = document.querySelector('[data-app-popup]');
    if (!pop) return;
    var KEY = 'shary-app-popup';
    var DAYS = 0;   // 0 = مرة في كل زيارة (sessionStorage) ، أو عدد الأيام بين كل ظهور (localStorage)

    function store() { return DAYS > 0 ? window.localStorage : window.sessionStorage; }
    function seen() { try { var at = Number(store().getItem(KEY)); return !!at && (DAYS === 0 || Date.now() - at < DAYS * 86400000); } catch (error) { return false; } }
    function mark() { try { store().setItem(KEY, String(Date.now())); } catch (error) { /* التخزين مقفول */ } }

    function close() {
        if (pop.hidden) return;
        pop.classList.remove('is-open');
        pop.setAttribute('aria-hidden', 'true');
        window.setTimeout(function () { pop.hidden = true; }, 380);
        mark();
        pop.dispatchEvent(new CustomEvent('shary:app-popup', { bubbles: true, detail: { open: false } }));
    }

    function open() {
        pop.hidden = false;
        pop.setAttribute('aria-hidden', 'false');
        window.requestAnimationFrame(function () { window.requestAnimationFrame(function () { pop.classList.add('is-open'); }); });
        pop.dispatchEvent(new CustomEvent('shary:app-popup', { bubbles: true, detail: { open: true } }));
    }

    pop.addEventListener('click', function (event) {
        if (event.target.closest('[data-app-popup-close]') || event.target.closest('[data-app-button]')) close();
    });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') close(); });
    window.SharyAppPopup = { open: open, close: close };

    // الكارت كله كليكابل: الضغط على أي مكان فيه (غير زرار القفل) = الضغط على زرار التحميل
    var card = pop.querySelector('.app-pop__card');
    if (card) card.addEventListener('click', function (event) {
        if (event.target.closest('[data-app-popup-close], [data-app-button]')) return;
        var cta = card.querySelector('[data-app-button]');
        if (cta) cta.click();
    });

    var mobile = window.matchMedia && window.matchMedia('(max-width: 1023px)').matches;
    if (!mobile || seen() || navigator.webdriver) return;   // navigator.webdriver: اختبارات آلية
    // العميل فاتح Shary AI: البوب أب ما يقطعش المحادثة — بيستنى لحد ما يقفلها
    function show() {
        var button = pop.querySelector('[data-app-button]');
        if (button && button.getAttribute('data-state') === 'open') return;   // التطبيق متسطّب
        var ai = document.querySelector('[data-ai-panel]');
        if (ai && Array.prototype.some.call(document.querySelectorAll('[data-ai-panel]'), function (panel) { return !panel.classList.contains('hidden'); })) { window.setTimeout(show, 4000); return; }
        if (seen()) return;
        open();
    }
    window.setTimeout(show, Number(pop.getAttribute('data-delay')) || 1800);
})();

/**
 * تنبيه سياسة الخصوصية [data-privacy-note] (partials/privacy-notice.blade.php): بيظهر في كل زيارة لحد ما العميل يضغط "موافق" [data-privacy-accept].
 * الموافقة بتتحفظ لحد قفل المتصفح (sessionStorage: shary-privacy) — EVERY_VISIT = false يخليها مرة واحدة على الجهاز. حدث shary:privacy-accept على العنصر — اسمعوه لو عايزين تسجلوها على السيرفر.
 */
(function () {
    var note = document.querySelector('[data-privacy-note]');
    if (!note) return;
    var KEY = 'shary-privacy';
    // بيظهر في كل زيارة لحد ما العميل يضغط "موافق" (محفوظ لحد قفل المتصفح — sessionStorage).
    // عايزينه مرة واحدة بس على الجهاز؟ خلّوا EVERY_VISIT = false (localStorage).
    var EVERY_VISIT = true;
    var store = null;
    try { store = EVERY_VISIT ? window.sessionStorage : window.localStorage; } catch (error) { /* التخزين مقفول: التنبيه بيظهر */ }
    var accepted = false;
    try { accepted = !!store && store.getItem(KEY) === '1'; } catch (error) { /* التخزين مقفول: التنبيه بيظهر */ }
    if (accepted || navigator.webdriver) return;   // navigator.webdriver: اختبارات آلية
    note.classList.remove('hidden');
    note.addEventListener('click', function (event) {
        if (!event.target.closest('[data-privacy-accept]')) return;
        try { if (store) store.setItem(KEY, '1'); } catch (error) { /* التخزين مقفول */ }
        note.classList.add('hidden');
        note.dispatchEvent(new CustomEvent('shary:privacy-accept', { bubbles: true }));
    });
})();

/**
 * سيستم اللوجوهات — مفيش لوجو يبان "مربع" جوه الدايرة:
 * اللوجو بيتعرض كامل (object-contain) جوه دايرة ، ولو صورة اللوجو خلفيتها لون ثابت (مش شفافة) الدايرة بتاخد نفس لون الخلفية فالمربع بيختفي.
 * بيشتغل لوحده على لوجوهات المطورين في كل الكروت والصفحات (والصور اللي بتتحمل بعدين). لأي صورة تانية: حطوا عليها data-logo-fit.
 * ملاحظة: قراءة لون الخلفية بتشتغل لما الصورة من نفس الدومين (أو عليها CORS) — غير كده اللوجو بيفضل على خلفية بيضا.
 * الأفضل من لوحة التحكم: رفع اللوجو PNG شفاف أو مربع 400×400 — راجعوا README.
 */
(function () {
    var SELECTOR = 'img[data-logo-fit], img.rounded-full.object-contain, .dev-logo-link img, .prop-shot__logo img, .dev-icon__logo img, .prop-bar__logo img, .developer-logo img, .req-menu__logo';

    function fit(img) {
        if (!img.naturalWidth || img.__logoFit === img.currentSrc) return;
        img.__logoFit = img.currentSrc;
        try {
            var canvas = document.createElement('canvas');
            var size = canvas.width = canvas.height = 24;
            var context = canvas.getContext('2d');
            context.drawImage(img, 0, 0, size, size);
            var corners = [[1, 1], [size - 2, 1], [1, size - 2], [size - 2, size - 2]].map(function (point) { return context.getImageData(point[0], point[1], 1, 1).data; });
            var first = corners[0];
            var solid = first[3] > 200 && corners.every(function (pixel) {
                return Math.abs(pixel[0] - first[0]) + Math.abs(pixel[1] - first[1]) + Math.abs(pixel[2] - first[2]) < 30 && pixel[3] > 200;
            });
            if (!solid) return;   // خلفية شفافة أو مش لون واحد: بيفضل على الأبيض
            var color = 'rgb(' + first[0] + ',' + first[1] + ',' + first[2] + ')';
            img.style.backgroundColor = color;
            var box = img.parentElement;
            if (box && box.clientWidth && box.clientWidth <= img.clientWidth * 1.7 && window.getComputedStyle(box).borderTopLeftRadius !== '0px') box.style.backgroundColor = color;
        } catch (error) { /* صورة من دومين تاني من غير CORS */ }
    }

    function scan(scope) { (scope || document).querySelectorAll(SELECTOR).forEach(function (img) { if (img.complete) fit(img); }); }

    document.addEventListener('load', function (event) {
        var img = event.target;
        if (img && img.tagName === 'IMG' && img.matches(SELECTOR)) fit(img);
    }, true);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { scan(); }); else scan();
    window.SharyLogoFit = { scan: scan };
})();

/**
 * سيستم "الصورة الطبيعية" (photo-fit) — مع ستايل .rent-gallery في app.css:
 * معرض الصور (المشروع / الوحدة / الإيجار) بياخد نسبة أول صورة فيه: السكربت بيحط --photo-ratio (العرض ÷ الارتفاع ، بين 5:4 و 16:9) على المعرض أول ما الصورة تحمل ،
 * فالصورة الكبيرة على الموبايل بتتعرض كاملة بنسبتها الطبيعية (من غير تكبير ولا قص ولا صورة وراها). من أي كود بعد تغيير الصور: window.SharyPhotoFit.scan().
 */
(function () {
    function fit(gallery) {
        var img = gallery.querySelector('[data-gallery-item] img');
        if (!img || !img.naturalWidth || !img.naturalHeight) return;
        var ratio = Math.max(1.25, Math.min(1.78, img.naturalWidth / img.naturalHeight));
        gallery.style.setProperty('--photo-ratio', ratio.toFixed(3));
        if (gallery.parentNode && gallery.parentNode.style) gallery.parentNode.style.setProperty('--photo-ratio', ratio.toFixed(3));
    }
    function scan(scope) { (scope || document).querySelectorAll('[data-rent-gallery]').forEach(fit); }
    document.addEventListener('load', function (event) {
        var img = event.target;
        var gallery = img && img.tagName === 'IMG' && img.closest ? img.closest('[data-rent-gallery]') : null;
        if (gallery && gallery.querySelector('[data-gallery-item] img') === img) fit(gallery);
    }, true);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { scan(); }); else scan();
    window.SharyPhotoFit = { scan: scan };
})();

/**
 * اختيار كود الدولة جنب رقم الهاتف (فورم الاستشارة).
 * بيشتغل على أي عنصر عليه data-phone-field: الزرار بيفتح القايمة، والاختيار بيغيّر العلم والكود
 * وقيمة الحقل المخفي country_code اللي بتتبعت مع الفورم.
 */
(function () {
    document.querySelectorAll('[data-phone-field]').forEach(function (field) {
        var toggle = field.querySelector('[data-phone-toggle]');
        var list = field.querySelector('[data-phone-list]');
        var flag = field.querySelector('[data-phone-flag]');
        var code = field.querySelector('[data-phone-code]');
        var value = field.querySelector('[data-phone-value]');
        var input = field.querySelector('input[type="tel"]');
        var options = Array.prototype.slice.call(list.querySelectorAll('[role="option"]'));

        function isOpen() {
            return !list.classList.contains('hidden');
        }

        function open(state) {
            list.classList.toggle('hidden', !state);
            toggle.setAttribute('aria-expanded', state ? 'true' : 'false');
            if (state) {
                var current = list.querySelector('[aria-selected="true"]') || options[0];
                current.focus();
            }
        }

        function select(option) {
            options.forEach(function (o) { o.setAttribute('aria-selected', o === option ? 'true' : 'false'); });
            flag.src = option.querySelector('img').src;
            code.textContent = option.getAttribute('data-code');
            value.value = option.getAttribute('data-code');
            open(false);
            input.focus();
        }

        toggle.addEventListener('click', function () { open(!isOpen()); });

        options.forEach(function (option, index) {
            option.addEventListener('click', function () { select(option); });
            option.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    select(option);
                } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    var next = options[index + (e.key === 'ArrowDown' ? 1 : -1)];
                    if (next) next.focus();
                } else if (e.key === 'Escape') {
                    open(false);
                    toggle.focus();
                }
            });
        });

        document.addEventListener('click', function (e) {
            if (isOpen() && !field.contains(e.target)) open(false);
        });
    });
})();

/**
 * فورم "طلب اجتماع":
 * - أي عنصر عليه data-meeting-open (زرار "طلب مقابلة") بيفتح الفورم، وبتتقفل من علامة X أو الضغط براها أو Esc.
 * - زووم / اجتماع حضوري، واختيار اليوم والوقت: الاختيار بيتسجل في الحقول المخفية meeting_type و meeting_date و meeting_time.
 * - الأيام: السبع أيام الجاية (من بكرة) بتترسم من القالب <template data-meeting-day-template>، بلغة الصفحة.
 *   لو زراير الأيام مرسومة من الباك إند (عليها data-meeting-day) السكربت بيستخدمها زي ما هي.
 */
(function () {
    var modals = Array.prototype.slice.call(document.querySelectorAll('[data-meeting-modal]'));
    if (!modals.length) return;

    var lastOpener = null;

    function pad(number) {
        return (number < 10 ? '0' : '') + number;
    }

    function press(buttons, chosen) {
        buttons.forEach(function (button) { button.setAttribute('aria-pressed', button === chosen ? 'true' : 'false'); });
    }

    function fillDays(modal, dateField) {
        var holder = modal.querySelector('[data-meeting-days]');
        var template = modal.querySelector('[data-meeting-day-template]');
        if (!holder) return [];

        if (!holder.children.length && template) {
            var langNode = modal.closest('[lang]');
            var english = ((langNode && langNode.lang) || document.documentElement.lang || 'ar').indexOf('en') === 0;
            var locale = english ? 'en-GB' : 'ar-EG-u-nu-latn';
            var count = parseInt(holder.getAttribute('data-count'), 10) || 7;

            for (var i = 1; i <= count; i++) {
                var day = new Date();
                day.setDate(day.getDate() + i);
                var button = template.content.firstElementChild.cloneNode(true);
                button.setAttribute('data-meeting-day', day.getFullYear() + '-' + pad(day.getMonth() + 1) + '-' + pad(day.getDate()));
                button.querySelector('[data-meeting-day-name]').textContent = day.toLocaleDateString(locale, { weekday: english ? 'short' : 'long' });
                button.querySelector('[data-meeting-day-date]').textContent = day.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
                holder.appendChild(button);
            }
        }

        var days = Array.prototype.slice.call(holder.querySelectorAll('[data-meeting-day]'));
        days.forEach(function (button) {
            button.addEventListener('click', function () {
                press(days, button);
                dateField.value = button.getAttribute('data-meeting-day');
            });
        });
        if (days.length) {
            var chosen = holder.querySelector('[aria-pressed="true"]') || days[0];
            press(days, chosen);
            dateField.value = chosen.getAttribute('data-meeting-day');
        }
        return days;
    }

    function close(modal) {
        if (modal.classList.contains('hidden')) return;
        modal.classList.add('hidden');
        document.documentElement.style.overflow = '';
        if (lastOpener) lastOpener.focus({ preventScroll: true });
        if (window.SharyBack) window.SharyBack.closed();
    }

    function open(modal, opener) {
        lastOpener = opener;
        modal.classList.remove('hidden');
        document.documentElement.style.overflow = 'hidden';
        // زرار الرجوع بيقفل الفورم والعميل بيفضل في الصفحة
        if (window.SharyBack) window.SharyBack.opened(function () { close(modal); });
        var first = modal.querySelector('input[name="name"]');
        if (first) first.focus({ preventScroll: true });
    }

    modals.forEach(function (modal) {
        var typeField = modal.querySelector('[data-meeting-type]');
        var timeField = modal.querySelector('[data-meeting-time]');
        var types = Array.prototype.slice.call(modal.querySelectorAll('[data-meeting-type-option]'));
        var times = Array.prototype.slice.call(modal.querySelectorAll('[data-meeting-time-option]'));

        fillDays(modal, modal.querySelector('[data-meeting-date]'));

        types.forEach(function (button) {
            button.addEventListener('click', function () {
                press(types, button);
                typeField.value = button.getAttribute('data-meeting-type-option');
            });
        });

        times.forEach(function (button) {
            button.addEventListener('click', function () {
                press(times, button);
                timeField.value = button.getAttribute('data-meeting-time-option');
            });
        });

        modal.querySelectorAll('[data-meeting-close]').forEach(function (element) {
            element.addEventListener('click', function () { close(modal); });
        });
    });

    // الزرار بيفتح أقرب فورم ليه في الصفحة
    document.addEventListener('click', function (event) {
        var opener = event.target.closest ? event.target.closest('[data-meeting-open]') : null;
        if (!opener) return;
        var node = opener.parentElement;
        var modal = null;
        while (node && !modal) {
            modal = node.querySelector('[data-meeting-modal]');
            node = node.parentElement;
        }
        if (!modal) return;
        event.preventDefault();
        open(modal, opener);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        modals.forEach(function (modal) {
            if (!modal.classList.contains('hidden')) close(modal);
        });
    });
})();

/**
 * صفحة المنطقة:
 * - نوع الوحدة (سكني / تجاري / ...): بيغيّر أرقام المؤشر والمقارنة ونطاق السعر ورسم سعر المتر من غير تحميل الصفحة.
 *   الأرقام جاية من الـ JSON اللي في [data-area-index-data] (بيتكتب من الداتا في الـ Blade).
 * - رسم سعر المتر لآخر 12 شهر: بيترسم من series، وتحريك الماوس أو الإصبع عليه بيعرض سعر كل شهر.
 * - "إزاي اتحسب؟" بيفتح ويقفل تفاصيل المؤشر، وزراير + و − بتكبّر وتصغّر الخريطة.
 * - زرار "قارن" في كارت المشروع: بيتعلّم (aria-pressed) وبيبعت حدث shary:compare ({ active }).
 * - الفلاتر: أي اختيار بيبعت الفورم (GET) عشان الباك إند يرجّع النتايج.
 */
(function () {
    function format(number) {
        return Number(number).toLocaleString('en-US');
    }

    document.querySelectorAll('[data-area-index]').forEach(function (card) {
        var source = card.querySelector('[data-area-index-data]');
        if (!source) return;
        var data;
        try { data = JSON.parse(source.textContent); } catch (error) { return; }

        var plot = card.querySelector('[data-plot]');
        var line = card.querySelector('[data-plot-line]');
        var fill = card.querySelector('[data-plot-area]');
        var cursor = card.querySelector('[data-plot-cursor]');
        var endDot = card.querySelector('[data-plot-end]');
        var endTip = card.querySelector('[data-plot-end-tip]');
        var hoverDot = card.querySelector('[data-plot-dot]');
        var hoverTip = card.querySelector('[data-plot-tip]');
        var table = card.querySelector('[data-plot-table]');
        var values = [];
        var toY = function () { return 0; };

        function draw(series) {
            values = series;
            var min = Math.min.apply(null, series);
            var max = Math.max.apply(null, series);
            var pad = (max - min) * 0.25 || 1;
            var low = min - pad * 0.2;
            toY = function (value) { return 90 - ((value - low) / (max + pad - low)) * 80; };
            var points = series.map(function (value, i) { return (i / (series.length - 1) * 100).toFixed(2) + ',' + toY(value).toFixed(2); });

            line.setAttribute('d', 'M' + points.join('L'));
            fill.setAttribute('d', 'M' + points.join('L') + 'L100,100L0,100Z');
            var last = series[series.length - 1];
            endDot.style.left = '100%';
            endDot.style.top = toY(last) + '%';
            endTip.style.top = toY(last) + '%';
            endTip.textContent = format(last);
            table.innerHTML = '<caption>' + data.caption + '</caption>' + series.map(function (value, i) {
                return '<tr><th>' + data.months[i] + '</th><td>' + format(value) + '</td></tr>';
            }).join('');
        }

        function set(key, value) {
            card.querySelectorAll('[data-k="' + key + '"]').forEach(function (el) { el.textContent = value; });
        }

        function show(typeKey) {
            var type = data.types[typeKey];
            if (!type) return;
            ['price', 'price_range', 'change', 'label', 'demand', 'growth', 'index', 'compare_price', 'compare_range', 'compare_diff', 'compare_label', 'range', 'units', 'projects'].forEach(function (key) { set(key, type[key]); });
            var arc = card.querySelector('[data-k-arc]');
            if (arc) arc.setAttribute('stroke-dasharray', (type.index / 100 * 70.7).toFixed(1) + ' 94.2');
            type.bars.forEach(function (value, i) {
                var bar = card.querySelector('[data-bar="' + i + '"]');
                var label = card.querySelector('[data-bar-value="' + i + '"]');
                if (bar) bar.style.width = value + '%';
                if (label) label.textContent = value;
            });
            draw(type.series);
        }

        var buttons = Array.prototype.slice.call(card.querySelectorAll('[data-unit-type]'));
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                buttons.forEach(function (other) { other.setAttribute('aria-pressed', other === button ? 'true' : 'false'); });
                show(button.getAttribute('data-unit-type'));
            });
        });
        var current = card.querySelector('[data-unit-type][aria-pressed="true"]') || buttons[0];
        if (current) show(current.getAttribute('data-unit-type'));

        // سعر كل شهر مع تحريك الماوس أو الإصبع
        if (plot) {
            plot.addEventListener('pointermove', function (event) {
                if (!values.length) return;
                var box = plot.getBoundingClientRect();
                var ratio = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
                var i = Math.round(ratio * (values.length - 1));
                var x = i / (values.length - 1) * 100;
                plot.classList.add('is-active');
                cursor.setAttribute('x1', x);
                cursor.setAttribute('x2', x);
                hoverDot.style.left = x + '%';
                hoverDot.style.top = toY(values[i]) + '%';
                hoverTip.innerHTML = data.months[i] + '<br><b>' + format(values[i]) + '</b> ' + data.perMeter;
                hoverTip.style.left = Math.min(78, Math.max(22, x)) + '%';
            });
            plot.addEventListener('pointerleave', function () { plot.classList.remove('is-active'); });
        }

        var how = card.querySelector('[data-index-how]');
        var bars = card.querySelector('[data-index-bars]');
        if (how && bars) {
            how.addEventListener('click', function () {
                var open = bars.hidden;
                bars.hidden = !open;
                how.setAttribute('aria-expanded', open ? 'true' : 'false');
                var arrow = how.querySelector('svg');
                if (arrow) arrow.style.transform = open ? '' : 'rotate(180deg)';
            });
        }

        var rings = card.querySelector('[data-map-rings]');
        card.querySelectorAll('[data-map-zoom]').forEach(function (button) {
            button.addEventListener('click', function () {
                // + و − : الدواير بتبدأ صغيرة وبتكبر لحد 3 مرات
                var zoom = parseFloat(rings.style.getPropertyValue('--zoom') || 1) + Number(button.getAttribute('data-map-zoom')) * 0.35;
                rings.style.setProperty('--zoom', Math.max(0.65, Math.min(3, zoom)));
            });
        });
    });



    /**
     * فلاتر المشاريع (areas/partials/filters.blade.php)
     * - [data-sheet-open="اسم"] بيفتح اللوحة [data-filter-sheet="اسم"] (بتطلع من تحت). اللوحات: developer / project / area / price / all (صفحة "تصفية").
     * - "تطبيق" أو "عرض النتائج" [data-sheet-apply]: بيقفل اللوحة ويبعت الفورم. القفل من غير تطبيق بيرجّع الاختيار زي ما كان.
     * - لوحة مفتوحة من جوه صفحة "تصفية" (المنطقة / المطور): "تطبيق" بيرجع للصفحة من غير إرسال، والإرسال من "عرض النتائج".
     * - التبويب (وحدات المطور / إعادة البيع / للإيجار) بيغيّر الاختيارات: أي عنصر عليه data-modes بيظهر مع تبويباته بس، وحدود السعر والمساحة بتتغير من data-bounds.
     * - قبل الإرسال بيطلع حدث shary:filter على الفورم. امنعوه (preventDefault) لو هتجيبوا النتايج AJAX.
     * - صفحة البحث (search/partials/filters.blade.php):
     *   - الفلاتر السريعة: [data-sheet-open="section" data-sections="bedrooms bathrooms"] بيفتح لوحة من تحت فيها الأقسام دي نفسها
     *     (القسم [data-filter-section][data-key] بيتنقل للّوحة وبيرجع مكانه بعد القفل، فمفيش حقول متكررة). العدد: data-sheet-count="sec:bedrooms bathrooms".
     *   - الفورم اللي عليه data-filter-sidebar: على الديسك توب صفحة "تصفية" بتبقى عمود ثابت جنب النتايج، وأي تغيير فيه بيتبعت لوحده.
     */
    document.querySelectorAll('[data-area-filters]').forEach(function (form) {
        var STEPS = 1000;
        var stack = [];      // اللوحات المفتوحة فوق بعض
        var ranges = {};     // price / size

        function all(selector, root) { return Array.prototype.slice.call((root || form).querySelectorAll(selector)); }
        function sheet(name) { return form.querySelector('[data-filter-sheet="' + name + '"]'); }
        function commas(number) { return String(Math.round(number)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
        function digits(text) { return Number(String(text).replace(/[^\d]/g, '')) || 0; }
        function mode() { var picked = form.querySelector('input[name="offer"]:checked'); return picked ? picked.value : ''; }
        function bounds(range) { return range.bounds[mode()] || range.base; }

        // ---- شريط من–إلى: نفس المدى ممكن يكون مرسوم في أكتر من مكان، وكلهم بيتحركوا مع بعض
        function toValue(range, step) {
            if (step <= 0) return range.min;
            if (step >= STEPS) return range.max;
            if (!range.log) return Math.round(range.min + (range.max - range.min) * step / STEPS);
            var raw = range.min * Math.exp(Math.log(range.max / range.min) * step / STEPS);
            var unit = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10) - 1);
            return Math.round(raw / unit) * unit;
        }
        function toStep(range, value) {
            value = Math.max(range.min, Math.min(range.max, value));
            if (!range.log) return Math.round((value - range.min) / (range.max - range.min) * STEPS);
            return Math.round(Math.log(value / range.min) / Math.log(range.max / range.min) * STEPS);
        }
        function paint(range, skip) {
            var a = toStep(range, range.low);
            var b = toStep(range, range.high);
            range.views.forEach(function (view) {
                if (skip !== view.low) view.low.value = a;
                if (skip !== view.high) view.high.value = b;
                view.fill.style.insetInlineStart = (a / STEPS * 100) + '%';
                view.fill.style.insetInlineEnd = (100 - b / STEPS * 100) + '%';
                if (skip !== view.lowText) view.lowText.value = commas(range.low);
                if (skip !== view.highText) view.highText.value = commas(range.high);
            });
        }
        function commit(range) {
            range.minField.value = range.low > range.min ? range.low : '';
            range.maxField.value = range.high < range.max ? range.high : '';
        }
        function active(range) { return range.low > range.min || range.high < range.max; }

        all('[data-range]').forEach(function (root) {
            var name = root.getAttribute('data-range');
            var range = ranges[name];
            if (!range) {
                var extra = {};
                try { extra = JSON.parse(root.getAttribute('data-bounds') || '{}') || {}; } catch (error) { extra = {}; }
                range = ranges[name] = {
                    base: { min: Number(root.getAttribute('data-min')), max: Number(root.getAttribute('data-max')) }, bounds: Array.isArray(extra) ? {} : extra,
                    log: root.getAttribute('data-scale') === 'log',
                    minField: form.querySelector('[data-range-min="' + name + '"]'), maxField: form.querySelector('[data-range-max="' + name + '"]'), views: []
                };
                range.min = bounds(range).min;
                range.max = bounds(range).max;
                range.low = range.minField.value === '' ? range.min : Number(range.minField.value);
                range.high = range.maxField.value === '' ? range.max : Number(range.maxField.value);
            }
            var view = {
                low: root.querySelector('[data-range-low]'), high: root.querySelector('[data-range-high]'), fill: root.querySelector('[data-range-fill]'),
                lowText: root.querySelector('[data-range-low-text]'), highText: root.querySelector('[data-range-high-text]')
            };
            range.views.push(view);

            view.low.addEventListener('input', function () {
                if (Number(view.low.value) > Number(view.high.value) - 20) view.low.value = Number(view.high.value) - 20;
                range.low = toValue(range, Number(view.low.value));
                view.low.style.zIndex = 3; view.high.style.zIndex = 2;
                paint(range, view.low);
            });
            view.high.addEventListener('input', function () {
                if (Number(view.high.value) < Number(view.low.value) + 20) view.high.value = Number(view.low.value) + 20;
                range.high = toValue(range, Number(view.high.value));
                view.high.style.zIndex = 3; view.low.style.zIndex = 2;
                paint(range, view.high);
            });
            view.lowText.addEventListener('input', function () { view.lowText.value = commas(digits(view.lowText.value)); });
            view.highText.addEventListener('input', function () { view.highText.value = commas(digits(view.highText.value)); });
            view.lowText.addEventListener('change', function () { range.low = Math.max(range.min, Math.min(digits(view.lowText.value), range.high)); paint(range); });
            view.highText.addEventListener('change', function () { range.high = Math.min(range.max, Math.max(digits(view.highText.value) || range.max, range.low)); paint(range); });
        });
        Object.keys(ranges).forEach(function (name) { paint(ranges[name]); });

        // ---- التبويب بيحدد الاختيارات الظاهرة وحدود السعر والمساحة
        function applyMode() {
            var current = mode();
            all('[data-modes]').forEach(function (node) {
                var list = node.getAttribute('data-modes').trim();
                var shown = !list || list.split(' ').indexOf(current) > -1;
                node.classList.toggle('hidden', !shown);
                all('input', node).forEach(function (el) {
                    el.disabled = !shown;
                    if (!shown && (el.type === 'checkbox' || el.type === 'radio')) el.checked = false;
                });
            });
            Object.keys(ranges).forEach(function (name) {
                var range = ranges[name];
                var next = bounds(range);
                if (next.min !== range.min || next.max !== range.max) {
                    range.min = next.min; range.max = next.max;
                    range.low = next.min; range.high = next.max;
                }
                paint(range);
            });
        }
        all('input[name="offer"]').forEach(function (radio) { radio.addEventListener('change', function () { applyMode(); badges(); }); });

        // اختيار واحد ممكن يتشال بالضغط عليه تاني (مفروش / غير مفروش)
        all('[data-toggle-off]').forEach(function (radio) {
            radio.addEventListener('click', function () {
                if (radio.getAttribute('data-was') === '1') radio.checked = false;
                all('input[name="' + radio.name + '"]').forEach(function (other) { other.setAttribute('data-was', other.checked ? '1' : '0'); });
                badges();
            });
            radio.setAttribute('data-was', radio.checked ? '1' : '0');
        });

        // خانات الأرقام (المقدم / القسط): فواصل الآلاف وهو بيكتب
        all('[data-number]').forEach(function (input) {
            input.addEventListener('input', function () { input.value = digits(input.value) ? commas(digits(input.value)) : ''; });
        });

        // ---- حفظ الاختيار وقت الفتح عشان يرجع لو اللوحة اتقفلت من غير تطبيق
        function snapshot(root) {
            return {
                inputs: all('input', root).filter(function (el) { return el.type !== 'range' && el.type !== 'hidden'; }).map(function (el) { return [el, el.checked, el.value]; }),
                ranges: Object.keys(ranges).map(function (name) { return [name, ranges[name].low, ranges[name].high]; })
            };
        }
        function restore(state) {
            state.inputs.forEach(function (item) {
                if (item[0].type === 'checkbox' || item[0].type === 'radio') item[0].checked = item[1];
                else item[0].value = item[2];
            });
            applyMode();
            all('[data-toggle-off]').forEach(function (radio) { radio.setAttribute('data-was', radio.checked ? '1' : '0'); });
            state.ranges.forEach(function (item) { ranges[item[0]].low = item[1]; ranges[item[0]].high = item[2]; paint(ranges[item[0]]); });
        }

        // ---- عدد الاختيارات جنب اسم كل فلتر
        function section(key) { return form.querySelector('[data-filter-section][data-key="' + key + '"]'); }
        function count(name) {
            if (name === 'price') return ranges.price && active(ranges.price) ? 1 : 0;
            if (name.indexOf('sec:') === 0) {
                return name.slice(4).split(' ').reduce(function (total, key) {
                    return total + (section(key) ? all('input[type="checkbox"]:checked', section(key)).length : 0);
                }, 0);
            }
            if (name === 'all') {
                var page = sheet('all');
                if (!page) return 0;
                var total = all('input[type="checkbox"]:checked', page).length;
                total += all('[data-number]', page).filter(function (el) { return el.value !== ''; }).length;
                total += all('input[type="radio"]', page).filter(function (el, i) { return el.checked && i > 0; }).length;
                Object.keys(ranges).forEach(function (key) { if (active(ranges[key])) total++; });
                // لوحات الاختيار اللي بتتفتح من جوه الصفحة (في صفحة البحث: المشروع كمان)
                ['area', 'developer'].concat(form.hasAttribute('data-filter-sidebar') ? ['project'] : []).forEach(function (key) { if (sheet(key)) total += all('input:checked', sheet(key)).length; });
                return total;
            }
            return sheet(name) ? all('input[type="checkbox"]:checked', sheet(name)).length : 0;
        }
        // ---- الفلتر الذكي: المنطقة ← المطور ← المشروع. الصف اللي مش مرتبط بالمختار بيختفي (is-unrelated) ولو كان متعلّم بيتشال اختياره.
        //      المطور: data-areas = مناطق مشاريعه. المشروع: data-developer + data-areas. من غير الخصائص دي القايمة بتفضل كاملة.
        function relate() {
            function picked(name) { return all('input[name="' + name + '[]"]:checked').map(function (box) { return box.value; }); }
            function rows(name) { var body = form.querySelector('[data-list-body="' + name + '"]'); return body ? Array.prototype.slice.call(body.querySelectorAll('label')) : []; }
            function inAreas(row, areas) {
                if (!areas.length || !row.hasAttribute('data-areas')) return true;
                var own = row.getAttribute('data-areas').split(' ');
                return areas.some(function (slug) { return own.indexOf(slug) !== -1; });
            }
            function set(row, ok) {
                row.classList.toggle('is-unrelated', !ok);
                var box = row.querySelector('input[type="checkbox"]');
                if (!ok && box && box.checked) box.checked = false;
            }
            var areas = picked('area');
            rows('developer').forEach(function (row) { set(row, inAreas(row, areas)); });
            var developers = picked('developer');
            rows('project').forEach(function (row) {
                set(row, inAreas(row, areas) && (!developers.length || !row.hasAttribute('data-developer') || developers.indexOf(row.getAttribute('data-developer')) !== -1));
            });
        }

        function badges() {
            relate();
            // شريط "الأسعار حسب الفلاتر اللي اخترتها" (صفحة البحث): ظاهر طول ما فيه فلتر مختار
            var notice = form.querySelector('[data-filter-notice]');
            if (notice) notice.classList.toggle('hidden', count('all') === 0);
            all('[data-sheet-count]').forEach(function (badge) {
                var name = badge.getAttribute('data-sheet-count');
                var total = count(name);
                badge.textContent = total ? (name === 'price' ? '✓' : total) : '';
                var opener = badge.closest('[data-sheet-open]');
                if (opener) opener.classList.toggle('is-active', total > 0);
            });
        }

        function submit() {
            var go = form.dispatchEvent(new CustomEvent('shary:filter', { bubbles: true, cancelable: true }));
            if (go) form.submit();
        }

        // after: بتتنفذ بعد القفل (وبعد ما تاريخ المتصفح يرجع خطوة) — "عرض النتائج" بتبعت الفورم منها
        function close(keep, after) {
            var top = stack.pop();
            if (!top) { if (after) after(); return; }
            if (!keep) restore(top.saved);
            top.node.classList.add('hidden');
            // الأقسام اللي اتنقلت للّوحة بترجع مكانها في صفحة "تصفية"
            (top.moved || []).forEach(function (item) { item.marker.parentNode.insertBefore(item.node, item.marker); item.marker.parentNode.removeChild(item.marker); });
            // لوحة المنطقة / المطور: البحث بيتمسح والقايمة بترجع لعمود الفلاتر (ديسك توب)
            resetListSearch(top.node);
            placeLists();
            top.opener.setAttribute('aria-expanded', 'false');
            if (!stack.length) document.documentElement.style.overflow = '';
            badges();
            top.opener.focus({ preventScroll: true });
            if (window.SharyBack) window.SharyBack.closed(after); else if (after) after();
        }

        all('[data-sheet-open]').forEach(function (opener) {
            opener.addEventListener('click', function () {
                var name = opener.getAttribute('data-sheet-open');
                var node = sheet(name);
                if (!node) return;
                closeSort();
                var moved = [];
                if (name === 'section') {
                    var body = node.querySelector('[data-section-body]');
                    (opener.getAttribute('data-sections') || '').split(' ').forEach(function (key) {
                        var part = key && section(key);
                        if (!part || !body) return;
                        var marker = document.createComment('section ' + key);
                        part.parentNode.insertBefore(marker, part);
                        body.appendChild(part);
                        moved.push({ node: part, marker: marker });
                    });
                    if (!moved.length) return;
                }
                // لوحة المنطقة / المطور: القايمة بترجع جوه اللوحة (لو كانت معروضة في عمود الفلاتر) قبل ما نحفظ الاختيار
                var listBody = form.querySelector('[data-list-body="' + name + '"]');
                var listHome = node.querySelector('[data-list-home]');
                if (listBody && listHome && listBody.parentNode !== listHome) listHome.appendChild(listBody);
                // صفحة "تصفية" بتحفظ الفورم كله، واللوحة الصغيرة بتحفظ اختياراتها بس
                stack.push({ node: node, opener: opener, moved: moved, saved: snapshot(name === 'all' ? form : node) });
                node.classList.remove('hidden');
                opener.setAttribute('aria-expanded', 'true');
                document.documentElement.style.overflow = 'hidden';
                // زرار الرجوع بيقفل اللوحة (زي X) والعميل بيفضل في الصفحة
                if (window.SharyBack) window.SharyBack.opened(function () { close(false); });
            });
        });
        all('[data-sheet-close]').forEach(function (node) { node.addEventListener('click', function () { close(false); }); });
        document.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape') return;
            if (stack.length) close(false); else closeSort();
        });
        all('[data-sheet-apply]').forEach(function (button) {
            button.addEventListener('click', function () {
                Object.keys(ranges).forEach(function (name) { commit(ranges[name]); });
                close(true, function () { if (!stack.length) submit(); });
            });
        });

        // ---- "مسح": لقسم واحد، أو لكل الفلاتر
        function clear(root) {
            all('input', root).forEach(function (el) {
                if (el.type === 'checkbox') el.checked = false;
                else if (el.type === 'radio' && el.name !== 'offer' && el.name !== 'sort') { el.checked = false; el.setAttribute('data-was', '0'); }
                else if (el.type === 'text') el.value = '';
            });
            all('[data-range]', root).forEach(function (node) {
                var range = ranges[node.getAttribute('data-range')];
                range.low = range.min; range.high = range.max; paint(range);
            });
        }
        all('[data-filter-clear]').forEach(function (button) {
            button.addEventListener('click', function () {
                var section = button.closest('[data-filter-section]');
                clear(section);
                (section.getAttribute('data-clears') || '').split(' ').forEach(function (name) { if (name && sheet(name)) clear(sheet(name)); });
                badges();
            });
        });
        all('[data-filter-clear-all]').forEach(function (button) {
            button.addEventListener('click', function () {
                all('[data-filter-sheet]').forEach(function (node) { clear(node); });
                var first = form.querySelector('input[name="offer"]');
                if (first) first.checked = true;
                all('[data-default-radio]').forEach(function (radio) { radio.checked = true; });   // تبويب الصفحة يرجع لـ "الكل"
                applyMode();
                badges();
                // "مسح الفلاتر" اللي بره اللوحات (فوق النتايج) بيمسح ويبعت على طول
                if (!button.closest('[data-filter-sheet]')) {
                    Object.keys(ranges).forEach(function (name) { commit(ranges[name]); });
                    submit();
                }
            });
        });
        form.addEventListener('change', function (event) { if (event.target.type === 'checkbox' || event.target.type === 'radio' || event.target.hasAttribute('data-number')) badges(); });

        // ---- خانة البحث (Enter): نفس طريق "عرض النتائج"
        form.addEventListener('submit', function (event) { event.preventDefault(); submit(); });

        // ---- عمود الفلاتر الثابت (ديسك توب): أي تغيير بيتبعت لوحده بعد لحظة
        var sidebar = form.hasAttribute('data-filter-sidebar');
        var applyTimer = null;
        // عمود الفلاتر شغال لما الـ CSS يخلّي صفحة "تصفية" جزء من الصفحة (ديسك توب) بدل اللوحة اللي بتغطي الشاشة (موبايل)
        function wide() { var page = sheet('all'); return !!page && window.getComputedStyle(page).position !== 'fixed'; }

        // المنطقة / المطور: القايمة بتتعرض جوه العمود على الديسك توب، وبترجع للوحة الاختيار على الموبايل
        function placeLists() {
            all('[data-inline-list]').forEach(function (slot) {
                var name = slot.getAttribute('data-inline-list');
                var body = form.querySelector('[data-list-body="' + name + '"]');
                var home = sheet(name) && sheet(name).querySelector('[data-list-home]');
                if (!body || !home || !sheet(name).classList.contains('hidden')) return;   // اللوحة مفتوحة: القايمة بتفضل جواها
                var target = wide() ? slot : home;
                if (body.parentNode !== target) target.appendChild(body);
                // في العمود: المختار بيتعرض الأول (أول 3 بس ظاهرين، والباقي من "عرض المزيد")
                if (target === slot) {
                    Array.prototype.slice.call(body.children).filter(function (row) { var box = row.querySelector('input'); return box && box.checked; })
                        .reverse().forEach(function (row) { body.insertBefore(row, body.firstChild); });
                }
                var more = slot.parentNode.querySelector('[data-list-more]');
                if (more) more.classList.toggle('hidden', body.children.length <= 3);
            });
        }

        // خانة البحث جوه لوحة الاختيار: بتفلتر الصفوف بالاسم
        all('[data-list-search]').forEach(function (input) {
            input.addEventListener('input', function () {
                var words = input.value.trim().toLowerCase();
                all('label', input.closest('[data-filter-sheet]').querySelector('[data-list-body]') || input.closest('[data-filter-sheet]')).forEach(function (row) {
                    row.classList.toggle('hidden', words !== '' && row.textContent.toLowerCase().indexOf(words) === -1);
                });
            });
            input.addEventListener('keydown', function (event) { if (event.key === 'Enter') event.preventDefault(); });
        });
        function resetListSearch(node) {
            var input = node.querySelector('[data-list-search]');
            if (!input) return;
            input.value = '';
            all('label.hidden', node).forEach(function (row) { row.classList.remove('hidden'); });
        }
        function autoApply() {
            if (!sidebar || !wide() || stack.length) return;
            clearTimeout(applyTimer);
            applyTimer = setTimeout(function () {
                Object.keys(ranges).forEach(function (name) { commit(ranges[name]); });
                badges();
                submit();
            }, 450);
        }
        if (sidebar) {
            placeLists();
            var resizeTimer = null;
            window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(placeLists, 120); });
            form.addEventListener('change', function (event) {
                var page = sheet('all');
                if (page && page.contains(event.target) && event.target.name !== 'sort') autoApply();
            });
            all('[data-filter-clear], [data-filter-clear-all]').forEach(function (button) { button.addEventListener('click', autoApply); });
        }

        // ---- ديسك توب: إخفاء / إظهار عمود الفلاتر [data-side-toggle] — النتايج بتاخد عرض الصفحة كله والاختيار بيتحفظ طول الزيارة
        var layout = form.closest('.search-layout');
        if (sidebar && layout) {
            var setSide = function (hidden) {
                layout.classList.toggle('is-side-hidden', hidden);
                all('[data-side-toggle]').forEach(function (button) { button.setAttribute('aria-expanded', hidden ? 'false' : 'true'); });
                try { window.sessionStorage.setItem('shary-side-hidden', hidden ? '1' : ''); } catch (error) { /* التخزين مقفول */ }
            };
            all('[data-side-toggle]').forEach(function (button) {
                button.addEventListener('click', function () { setSide(!layout.classList.contains('is-side-hidden')); });
            });
            try { if (window.sessionStorage.getItem('shary-side-hidden') === '1') setSide(true); } catch (error) { /* التخزين مقفول */ }
        }

        // ---- الترتيب: قايمة تحت الزرار
        var sortOpen = form.querySelector('[data-sort-open]');
        var sortMenu = form.querySelector('[data-sort-menu]');
        function closeSort() {
            if (!sortMenu || sortMenu.classList.contains('hidden')) return;
            sortMenu.classList.add('hidden');
            sortOpen.setAttribute('aria-expanded', 'false');
        }
        if (sortOpen && sortMenu) {
            sortOpen.addEventListener('click', function () {
                var open = sortMenu.classList.toggle('hidden');
                sortOpen.setAttribute('aria-expanded', open ? 'false' : 'true');
            });
            document.addEventListener('click', function (event) {
                if (!sortMenu.contains(event.target) && !sortOpen.contains(event.target)) closeSort();
            });
            all('input[name="sort"]', sortMenu).forEach(function (radio) {
                radio.addEventListener('change', function () { closeSort(); sortOpen.classList.add('is-active'); submit(); });
            });
        }

        // اختيارات على الصفحة نفسها بتتبعت أول ما تتغير (تبويب الفرش في صفحة الإيجار)
        all('[data-submit-on-change]').forEach(function (input) { input.addEventListener('change', submit); });

        applyMode();
        Object.keys(ranges).forEach(function (name) { commit(ranges[name]); });
        badges();
    });
    // العروض: "عرض الكل" بيفرد كل العروض تحت بعض (زي قايمة بتتفتح)، و"عرض أقل" بيرجّع أول 3
    document.querySelectorAll('[data-offers]').forEach(function (section) {
        var toggle = section.querySelector('[data-offers-toggle]');
        var list = section.querySelector('[data-offers-list]');
        if (!toggle || !list) return;
        toggle.addEventListener('click', function () {
            var open = !list.classList.contains('is-open');
            list.classList.toggle('is-open', open);
            list.scrollLeft = 0;
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.querySelector('[data-label]').textContent = toggle.getAttribute(open ? 'data-less' : 'data-more');
            toggle.querySelector('svg').style.transform = open ? 'rotate(180deg)' : '';
            if (!open) section.scrollIntoView({ block: 'nearest' });
        });
    });
    // خريطة جوجل جوه كارت المؤشر: بتتحمل أول ما الكارت يظهر على الشاشة، وزرار السهمين بيكبّرها جوه نفس الصفحة ويرجّعها
    // لو الصفحة مفتوحة في مكان بيمنع تضمين خرائط جوجل (سياسة أمان الصفحة): الخريطة المرسومة بتفضل ظاهرة بدل مربع فاضي
    document.addEventListener('securitypolicyviolation', function (e) {
        if (String(e.violatedDirective || '').indexOf('frame') !== 0) return;
        document.querySelectorAll('[data-map-frame]').forEach(function (frame) {
            var box = frame.parentNode;
            box.classList.remove('is-live', 'is-expanded');
            box.classList.add('is-blocked');
            frame.hidden = true;
            var expand = box.querySelector('[data-map-expand]');
            if (expand) expand.hidden = true;
        });
    });

    document.querySelectorAll('[data-map-frame]').forEach(function (frame) {
        var box = frame.parentNode;
        function load() {
            if (frame.getAttribute('src') || box.classList.contains('is-blocked')) return;
            frame.addEventListener('load', function () { if (!box.classList.contains('is-blocked')) box.classList.add('is-live'); });
            frame.setAttribute('src', frame.getAttribute('data-src'));
        }
        // الخريطة تقيلة: بتتحمل بعد ما الصفحة نفسها تخلص تحميل، ولما الكارت يقرّب يظهر على الشاشة
        function watch() {
            if ('IntersectionObserver' in window) {
                var seen = new IntersectionObserver(function (entries) {
                    if (entries[0].isIntersecting) { load(); seen.disconnect(); }
                }, { rootMargin: '200px' });
                seen.observe(box);
            } else {
                load();
            }
        }
        if (document.readyState === 'complete') watch(); else window.addEventListener('load', function () { setTimeout(watch, 300); });
        var expand = box.querySelector('[data-map-expand]');
        if (!expand) return;
        function setOpen(open) {
            if (open) load();
            box.classList.toggle('is-expanded', open);
            document.documentElement.style.overflow = open ? 'hidden' : '';
            expand.setAttribute('aria-expanded', open ? 'true' : 'false');
            expand.setAttribute('aria-label', expand.getAttribute(open ? 'data-close' : 'data-expand'));
            if (open) load();
        }
        expand.addEventListener('click', function () { setOpen(!box.classList.contains('is-expanded')); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('is-expanded')) setOpen(false); });
    });
})();

/**
 * صفحة المطور (developers/show.blade.php)
 * - "عرض الكل / عرض أقل" في مناطق المطور: بيفرد المناطق كلها بدل السحب الأفقي.
 * - "عرض أقل / عرض المزيد" في "عن المطور" بقى في js/shary/site-chrome.js (مشترك لكل الصفحات).
 * - "عرض المزيد" تحت المشاريع (موبايل): بيظهر 3 مشاريع كمان كل مرة.
 */
(function () {
    document.querySelectorAll('[data-dev-areas]').forEach(function (section) {
        var toggle = section.querySelector('[data-dev-areas-toggle]');
        var list = section.querySelector('[data-dev-areas-list]');
        if (!toggle || !list) return;
        toggle.addEventListener('click', function () {
            var open = !list.classList.contains('is-open');
            list.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.querySelector('[data-label]').textContent = toggle.getAttribute(open ? 'data-less' : 'data-more');
            toggle.querySelector('svg').style.transform = open ? 'rotate(180deg)' : '';
        });
    });
})();

/**
 * صفحة نتايج البحث — التحميل وأنت نازل (من غير "عرض المزيد"):
 * - العنصر [data-infinite] تحت القايمة [data-results]. أول ما يقرب من الشاشة بيتطلب data-next-url ويتضاف اللي جوه [data-results] في الصفحة الجاية،
 *   وبيتاخد منها لينك الصفحة اللي بعدها. لينك فاضي = دي كل النتايج.
 * - الحالة على العنصر: data-state="idle | loading | done | error" (الـ CSS بيظهر "جاري التحميل" أو "دي كل النتايج").
 * - حدث shary:load-more ({ url, append(nodes, nextUrl) }): امنعوه (preventDefault) لو هتجيبوا النتايج بطريقتكم ونادوا append.
 * - لو بدّلتوا النتايج من غير تحميل الصفحة (فلترة AJAX): ابعتوا على [data-infinite] حدث shary:infinite-reset ({ nextUrl }) عشان التحميل يبدأ من الأول.
 *
 * خانة البحث (input name="q" جوه فورم الفلاتر): بتبحث باسم الكمبوند أو المطور أو المنطقة.
 * - Enter (أو زرار "بحث" في كيبورد الموبايل) أو مسح الخانة بالـ ×: الفورم بيتبعت بنفس طريقة الفلاتر (حدث shary:filter وبعده GET فيه q).
 * - وهو بيكتب: قايمة اقتراحات تحت الخانة من قوايم الفلتر نفسها (المنطقة / المطور / المشروع بالصورة أو اللوجو). الضغط على اقتراح بيعلّم الاختيار ده في الفلتر ويبعت الفورم
 *   (يعني area[] / developer[] / project[] — من غير أي endpoint جديد). الأسهم + Enter بيشتغلوا، و Esc بيقفل القايمة.
 * - وهو بيكتب كمان: حدث shary:search ({ q }) على الفورم بعد ما يقف كتابة — اسمعوه لو عايزين نتايج لايف من غير Enter.
 */
(function () {
    document.querySelectorAll('[data-infinite]').forEach(function (sentinel) {
        var list = sentinel.parentNode.querySelector('[data-results]');
        if (!list) return;
        var busy = false;
        var observer = null;
        var run = 0;   // بيزيد مع كل shary:infinite-reset عشان أي تحميل قديم لسه راجع يتجاهل

        function state(name) { sentinel.setAttribute('data-state', name); }

        function finish() {
            state('done');
            if (observer) { observer.disconnect(); observer = null; }
        }

        function append(nodes, nextUrl) {
            Array.prototype.slice.call(nodes || []).forEach(function (node) { list.appendChild(node); });
            if (window.SharyCards) window.SharyCards.refresh(list);
            sentinel.setAttribute('data-next-url', nextUrl || '');
            busy = false;
            if (!nextUrl || nextUrl === '#') { finish(); return; }
            state('idle');
            // لو العنصر لسه قريب من الشاشة بعد الإضافة (العميل واقف في آخر الصفحة) نكمّل تحميل
            setTimeout(function () { if (near()) load(); }, 60);
        }

        function near() {
            var box = sentinel.getBoundingClientRect();
            return box.height + box.width > 0 && box.top < window.innerHeight + 500 && box.bottom > -500;
        }

        function load() {
            if (busy || sentinel.getAttribute('data-state') === 'done') return;
            var url = sentinel.getAttribute('data-next-url');
            if (!url || url === '#') { finish(); return; }
            busy = true;
            state('loading');
            var mine = run;
            var detail = { url: url, append: function (nodes, nextUrl) { if (mine === run) append(nodes, nextUrl); } };
            if (!sentinel.dispatchEvent(new CustomEvent('shary:load-more', { bubbles: true, cancelable: true, detail: detail }))) return;
            fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
                .then(function (response) { if (!response.ok) throw new Error(response.status); return response.text(); })
                .then(function (html) {
                    var page = new DOMParser().parseFromString(html, 'text/html');
                    var incoming = page.querySelector('[data-results]');
                    var next = page.querySelector('[data-infinite]');
                    detail.append(incoming ? incoming.children : [], next ? next.getAttribute('data-next-url') : '');
                })
                .catch(function () { if (mine !== run) return; busy = false; state('error'); });
        }

        function watch() {
            if (observer) return;
            if ('IntersectionObserver' in window) {
                observer = new IntersectionObserver(function (entries) { if (entries[0].isIntersecting) load(); }, { rootMargin: '500px 0px' });
                observer.observe(sentinel);
            } else if (!sentinel.getAttribute('data-scroll-bound')) {
                sentinel.setAttribute('data-scroll-bound', '1');
                window.addEventListener('scroll', function () { if (near()) load(); });
            }
        }

        function start() {
            busy = false;
            if (!sentinel.getAttribute('data-next-url') || sentinel.getAttribute('data-next-url') === '#') { finish(); return; }
            state('idle');
            watch();
            setTimeout(function () { if (near()) load(); }, 60);
        }

        var retry = sentinel.querySelector('[data-infinite-retry]');
        if (retry) retry.addEventListener('click', load);

        // النتايج اتبدّلت من غير تحميل الصفحة (فلترة AJAX): ابعتوا الحدث ده بلينك الصفحة اللي بعدها عشان التحميل يبدأ من الأول
        sentinel.addEventListener('shary:infinite-reset', function (event) {
            run++;
            sentinel.setAttribute('data-next-url', (event.detail && event.detail.nextUrl) || '');
            start();
        });

        start();
    });

    // ---- خانة البحث
    // توحيد النص: حروف صغيرة، من غير تشكيل، وتوحيد الألف والياء والتاء المربوطة — عشان "راس الحكمه" تلاقي "رأس الحكمة"
    function plain(text) {
        return String(text || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
            .replace(/[-_،,]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    document.querySelectorAll('form[data-area-filters] input[name="q"]').forEach(function (input) {
        var form = input.form;
        var bar = input.closest('.search-bar') || input.parentNode;
        var timer = null;
        var hideTimer = null;
        var sent = input.value;
        var panel = null;
        var shown = [];     // الاقتراحات الظاهرة
        var active = -1;    // الاقتراح المتعلّم بالأسهم

        function send() {
            clearTimeout(timer);
            hide();
            sent = input.value;
            // نفس طريق الفلاتر: area-page.js بيسمع submit ويطلع shary:filter. لو مفيش حد سمع، الفورم بيتبعت عادي
            var go = form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            if (go) form.submit();
        }

        // الاقتراحات من قوايم الفلتر نفسها (المنطقة / المطور / المشروع) — اختيار اقتراح = تعليم الاختيار ده في الفلتر وإرسال الفورم
        function options() {
            var out = [];
            ['area', 'developer', 'project'].forEach(function (kind) {
                Array.prototype.forEach.call(form.querySelectorAll('input[name="' + kind + '[]"]'), function (box) {
                    var row = box.closest('label');
                    if (!row || box.checked || box.disabled) return;
                    var nameNode = row.querySelector('[data-list-name]');
                    var name = (nameNode ? nameNode.textContent : row.textContent).trim();
                    // الصورة / اللوجو (ومعاه دايرة الحروف المختصرة اللي بتظهر لو اللوجو ما حملش)
                    var thumb = Array.prototype.filter.call(row.children, function (node) { return node !== nameNode && node !== box; });
                    out.push({ kind: kind, box: box, name: name, text: plain(name + ' ' + box.value), thumb: thumb });
                });
            });
            return out;
        }

        function hide() {
            clearTimeout(hideTimer);
            if (panel) panel.hidden = true;
            shown = [];
            active = -1;
            input.setAttribute('aria-expanded', 'false');
        }

        function mark(index) {
            active = index;
            shown.forEach(function (item, i) { item.node.classList.toggle('is-active', i === index); });
        }

        function choose(item) {
            item.box.checked = true;
            item.box.dispatchEvent(new Event('change', { bubbles: true }));
            input.value = '';
            input.blur();
            send();
        }

        function suggest() {
            var words = plain(input.value).split(' ').filter(Boolean);
            if (!words.length) { hide(); return; }
            var found = options().filter(function (item) { return words.every(function (word) { return item.text.indexOf(word) > -1; }); });
            // لحد 4 من كل نوع، و8 في المجموع
            var count = {};
            found = found.filter(function (item) { count[item.kind] = (count[item.kind] || 0) + 1; return count[item.kind] <= 4; }).slice(0, 8);
            if (!found.length) { hide(); return; }
            if (!panel) {
                panel = document.createElement('div');
                panel.className = 'search-suggest';
                panel.setAttribute('role', 'listbox');
                panel.setAttribute('aria-label', input.getAttribute('data-suggest-label') || '');
                bar.appendChild(panel);
            }
            panel.textContent = '';
            shown = found.map(function (item, index) {
                var node = document.createElement('button');
                node.type = 'button';
                node.className = 'search-suggest__row';
                node.setAttribute('role', 'option');
                var thumb = document.createElement('span');
                thumb.className = 'search-suggest__thumb';
                item.thumb.forEach(function (part) { thumb.appendChild(part.cloneNode(true)); });
                var name = document.createElement('span');
                name.className = 'search-suggest__name';
                name.textContent = item.name;
                var kind = document.createElement('span');
                kind.className = 'search-suggest__kind';
                kind.textContent = input.getAttribute('data-kind-' + item.kind) || '';
                node.appendChild(thumb); node.appendChild(name); node.appendChild(kind);
                node.addEventListener('mousedown', function (event) { event.preventDefault(); });   // الخانة تفضل متعلّمة لحد الضغطة
                node.addEventListener('click', function () { choose(item); });
                panel.appendChild(node);
                return { node: node, box: item.box };
            });
            active = -1;
            panel.hidden = false;
            input.setAttribute('aria-expanded', 'true');
        }

        input.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                if (!shown.length) return;
                event.preventDefault();
                mark((active + (event.key === 'ArrowDown' ? 1 : shown.length - 1) + (active < 0 && event.key === 'ArrowUp' ? 1 : 0)) % shown.length);
            } else if (event.key === 'Escape' && shown.length) {
                event.stopPropagation();
                hide();
            } else if (event.key === 'Enter') {
                event.preventDefault();
                if (active > -1 && shown[active]) { choose(shown[active]); return; }
                input.blur();   // بيقفل كيبورد الموبايل
                send();
            }
        });
        // مسح الخانة بالـ × اللي جواها
        input.addEventListener('search', function () { if (input.value === '' && sent !== '') send(); });
        input.addEventListener('input', function () {
            suggest();
            clearTimeout(timer);
            timer = setTimeout(function () {
                form.dispatchEvent(new CustomEvent('shary:search', { bubbles: true, detail: { q: input.value.trim() } }));
            }, 350);
        });
        input.addEventListener('focus', suggest);
        input.addEventListener('blur', function () { clearTimeout(hideTimer); hideTimer = setTimeout(hide, 180); });
    });
})();

/**
 * صفحة مؤشر شاري (shary-index/show.blade.php)
 * - نوع الوحدة (سكني / تجاري / ...): بيغيّر أرقام السوق، جملة الشهر، الرسم، جدول المناطق، "الأبرز هذا الشهر"،
 *   ميزانيتك تجيب إيه، الحاسبة، المقارنة وبدائل الاستثمار من غير تحميل الصفحة.
 *   الأرقام جاية من الـ JSON اللي في [data-index-data] (بيتكتب من الداتا في الـ Blade).
 * - رسم سعر المتر: المدة (3 شهور / سنة / 3 سنين)، وتحريك الماوس أو الإصبع عليه بيعرض سعر كل شهر.
 * - جدول المناطق: بحث بالاسم + ترتيب + "عرض كل المناطق".
 * - ميزانيتك تجيب إيه: المبلغ ÷ سعر المتر = المساحة في كل منطقة.
 * - حاسبة العائد: المقدم، القسط، القيمة المتوقعة، دخل الإيجار، العائد الإجمالي، استرداد رأس المال (أرقام تقديرية).
 * - قارن بين منطقتين: 6 مقارنات بشريطين على نفس المقياس.
 * - المنطقة (مصر كلها أو منطقة بعينها): أرقام الهيدر والرسم وجملة الشهر بتتبعها.
 * - اختيار المنطقة والترتيب بنفس تصميم الموقع: لوحة اختيار [data-index-picker] وقايمة ترتيب تحت الزرار — والقيمة في select مخفي.
 * كل تغيير بيبعت حدث shary:index-change ({ type, area, period, sort, query, a, b, budget, advanced }) لو الباك إند عايز يتابعه.
 */
(function () {
    function format(number) { return Math.round(Number(number)).toLocaleString('en-US'); }
    function percent(value, digits) { return (value >= 0 ? '+' : '−') + Math.abs(value).toFixed(digits === undefined ? 1 : digits) + '%'; }
    function digits(text) { return Number(String(text || '').replace(/[^\d.]/g, '')) || 0; }
    function plain(text) {
        return String(text || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').trim();
    }

    document.querySelectorAll('[data-shary-index]').forEach(function (page) {
        var source = page.querySelector('[data-index-data]');
        if (!source) return;
        var data;
        try { data = JSON.parse(source.textContent); } catch (error) { return; }

        var trendTitle = page.querySelector('[data-k="trend_title"]');
        if (trendTitle) trendTitle.__default = trendTitle.textContent;
        var areas = {};
        data.areas.forEach(function (area) { areas[area.slug] = area; });
        var typeKey = Object.keys(data.types)[0];
        var areaKey = '';   // '' = مصر كلها ، أو slug منطقة: أرقام الهيدر والرسم بتتبعه
        var period = 12;    // عدد الشهور في الرسم
        var limit = 8;      // عدد المناطق الظاهرة قبل "عرض كل المناطق"

        // ---------- أرقام السوق + الرسم ----------
        var plot = page.querySelector('[data-plot]');
        var line = page.querySelector('[data-plot-line]');
        var fill = page.querySelector('[data-plot-area]');
        var cursor = page.querySelector('[data-plot-cursor]');
        var endDot = page.querySelector('[data-plot-end]');
        var endTip = page.querySelector('[data-plot-end-tip]');
        var hoverDot = page.querySelector('[data-plot-dot]');
        var hoverTip = page.querySelector('[data-plot-tip]');
        var table = page.querySelector('[data-plot-table]');
        var values = [];
        var labels = [];
        var toY = function () { return 0; };

        function draw() {
            if (!plot) return;
            // آخر N شهر (+ الشهر اللي قبلهم عشان نسبة التغير تتحسب من أول المدة)
            var all = scope().series;
            var count = Math.min(all.length, period === 36 ? 36 : period + 1);
            values = all.slice(-count);
            labels = data.months.slice(-count);
            var min = Math.min.apply(null, values);
            var max = Math.max.apply(null, values);
            var pad = (max - min) * 0.25 || 1;
            var low = min - pad * 0.2;
            toY = function (value) { return 90 - ((value - low) / (max + pad - low)) * 80; };
            var points = values.map(function (value, i) { return (i / (values.length - 1) * 100).toFixed(2) + ',' + toY(value).toFixed(2); });
            line.setAttribute('d', 'M' + points.join('L'));
            fill.setAttribute('d', 'M' + points.join('L') + 'L100,100L0,100Z');
            var last = values[values.length - 1];
            endDot.style.left = '100%';
            endDot.style.top = toY(last) + '%';
            endTip.style.top = toY(last) + '%';
            endTip.textContent = format(last);
            table.innerHTML = '<caption>' + data.caption + '</caption>' + values.map(function (value, i) {
                return '<tr><th>' + labels[i] + '</th><td>' + format(value) + '</td></tr>';
            }).join('');

            var text = function (selector, value) { var el = page.querySelector(selector); if (el) el.textContent = value; };
            text('[data-plot-from]', labels[0]);
            text('[data-plot-mid]', labels[Math.floor((labels.length - 1) / 2)]);
            text('[data-plot-to]', labels[labels.length - 1]);
            var change = (last / values[0] - 1) * 100;
            text('[data-period-value]', percent(change));
            var pill = page.querySelector('[data-period-change]');
            if (pill) pill.setAttribute('data-sign', change >= 0 ? 'up' : 'down');
        }

        if (plot) {
            plot.addEventListener('pointermove', function (event) {
                if (!values.length) return;
                var box = plot.getBoundingClientRect();
                var ratio = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
                var i = Math.round(ratio * (values.length - 1));
                var x = i / (values.length - 1) * 100;
                plot.classList.add('is-active');
                cursor.setAttribute('x1', x);
                cursor.setAttribute('x2', x);
                hoverDot.style.left = x + '%';
                hoverDot.style.top = toY(values[i]) + '%';
                hoverTip.innerHTML = labels[i] + '<br><b>' + format(values[i]) + '</b> ' + data.perMeter;
                hoverTip.style.left = Math.min(78, Math.max(22, x)) + '%';
            });
            plot.addEventListener('pointerleave', function () { plot.classList.remove('is-active'); });
        }

        var periods = Array.prototype.slice.call(page.querySelectorAll('[data-index-period]'));
        periods.forEach(function (button) {
            button.addEventListener('click', function () {
                periods.forEach(function (other) { other.setAttribute('aria-pressed', other === button ? 'true' : 'false'); });
                period = Number(button.getAttribute('data-index-period')) || 12;
                draw();
                announce();
            });
        });

        function set(key, value) {
            page.querySelectorAll('[data-k="' + key + '"]').forEach(function (el) { el.textContent = value; });
        }

        // جدول "متوسط سعر المتر حسب نوع الوحدة" [data-type-row]: أرقام المنطقة المختارة في الفلتر (أو السوق كله لو "مصر كلها")
        function fillTypeRows() {
            page.querySelectorAll('[data-type-row]').forEach(function (row) {
                var key = row.getAttribute('data-type-row');
                var market = data.types[key] ? data.types[key].market : null;
                var own = areaKey && areas[areaKey] && areas[areaKey].values[key] ? areas[areaKey].values[key] : null;
                var from = own || market;
                if (!from) return;
                var cell = function (name, value) { var node = row.querySelector('[data-cell="' + name + '"]'); if (node) node.textContent = value; return node; };
                cell('price', from.price_range_text || from.price_text);
                var yearly = cell('yearly', from.yearly_text);
                if (yearly) yearly.setAttribute('data-sign', Number(from.yearly) >= 0 ? 'up' : 'down');
                cell('yield', from.yield_text);
                cell('range', own ? (own.resale_range_text || own.resale_text || '—') : market.range_text);
                cell('demand', from.demand);
            });
        }

        // أرقام الاختيار الحالي: السوق كله (مصر) أو منطقة بعينها — نفس المفاتيح في الحالتين
        function scope() {
            var type = data.types[typeKey];
            if (!areaKey || !areas[areaKey]) {
                var market = type.market;
                return { name: data.scopeAll, price_text: market.price_range_text || market.price_text, yearly_text: market.yearly_text, monthly_text: market.monthly_text, yield_text: market.yield_text,
                    units_text: market.units_text, demand: market.demand, range_label: data.range, range_text: market.range_text, series: market.series,
                    headline: data.headlines[typeKey] || '', insights: data.insights[typeKey] || [] };
            }
            var area = areas[areaKey];
            var v = area.values[typeKey];
            // سعر المتر لآخر 3 سنين للمنطقة: من السعر الحالي ونسبة الزيادة السنوية (في الموقع بييجي من المؤشر جاهز)
            var end = v.price, parts = [];
            [v.yearly, v.yearly * 0.85, v.yearly * 0.7].forEach(function (rate) {
                var start = end / (1 + rate / 100);
                parts.unshift(data.weights.map(function (w) { return Math.round((start + (end - start) * w) / 100) * 100; }));
                end = start;
            });
            var fill = function (text, map) { return Object.keys(map).reduce(function (out, key) { return out.replace(':' + key, map[key]); }, text); };
            return { name: area.name, price_text: v.price_range_text || v.price_text, yearly_text: v.yearly_text, monthly_text: v.monthly_text, yield_text: v.yield_text,
                units_text: v.units_text, demand: v.demand, range_label: data.resaleRange, range_text: v.resale_range_text || v.resale_text, series: parts[0].concat(parts[1], parts[2]),
                headline: fill(data.headlineArea, { type: type.label_in, area: area.name, price: v.price_range_text || v.price_text, yearly: v.yearly_text, verdict: v.verdict_text }),
                insights: [fill(data.insightYield, { value: v.yield_text }), fill(data.insightResale, { value: v.resale_diff_text }), fill(data.insightDemand, { demand: v.demand, units: v.units_text })] };
        }

        function showMarket() {
            var type = data.types[typeKey];
            var now = scope();
            set('label', type.label);
            set('label_in_units', type.label);
            set('scope', now.name);
            set('headline', now.headline);
            set('trend_title', areaKey ? data.trendTitleIn.replace(':area', now.name) : (page.querySelector('[data-k="trend_title"]') || {}).__default || '');
            set('price', now.price_text);
            set('yearly', now.yearly_text);
            set('monthly', now.monthly_text);
            set('yield', now.yield_text);
            set('units', now.units_text);
            set('demand', now.demand);
            set('range_label', now.range_label);
            set('range', now.range_text);
            draw();
            fillTypeRows();

            var insights = page.querySelector('[data-insights]');
            if (insights) {
                insights.textContent = '';
                now.insights.forEach(function (text) {
                    var li = document.createElement('li');
                    li.textContent = text;
                    insights.appendChild(li);
                });
            }
        }

        // ---------- جدول المناطق ----------
        var section = page.querySelector('[data-index-areas]');
        var body = page.querySelector('[data-index-rows]');
        var rows = body ? Array.prototype.slice.call(body.querySelectorAll('tr[data-slug]')) : [];
        var search = page.querySelector('[data-index-search]');
        var sort = page.querySelector('[data-index-sort]');
        var more = page.querySelector('[data-index-more]');
        var empty = page.querySelector('[data-index-empty]');
        var expanded = false;
        // الفلتر المتقدم المتطبّق على الجدول: الجهة / التقييم / أقل نمو سنوي / أقل عائد إيجار
        var adv = { group: '', verdict: '', growth: 0, yield: 0 };
        function advMatch(slug, filter) {
            var area = areas[slug], v = area.values[typeKey];
            return (!filter.group || area.group_key === filter.group) && (!filter.verdict || v.verdict === filter.verdict) && v.yearly >= filter.growth && v.yield >= filter.yield;
        }
        function advOn(filter) { return !!(filter.group || filter.verdict || filter.growth || filter.yield); }

        function fillRows() {
            rows.forEach(function (row) {
                var v = areas[row.getAttribute('data-slug')].values[typeKey];
                var cell = function (name) { return row.querySelector('[data-c="' + name + '"]'); };
                var put = function (name, value) { var el = cell(name); if (el) el.textContent = value; };
                put('price', v.price_range_text || v.price_text);
                put('yield', v.yield_text);
                put('units', v.units_text);
                put('demand', v.demand);
                put('verdict', v.verdict_text);
                if (cell('verdict')) cell('verdict').setAttribute('data-verdict', v.verdict);
                [['yearly', v.yearly, v.yearly_text], ['resale_diff', v.resale_diff, v.resale_diff_text]].forEach(function (entry) {
                    var el = cell(entry[0]);
                    if (!el) return;
                    el.textContent = entry[2];
                    el.setAttribute('data-sign', entry[1] >= 0 ? 'up' : 'down');
                });
                var bar = row.querySelector('[data-c-bar="demand"]');
                if (bar) bar.style.width = v.demand + '%';
            });
        }

        function arrange() {
            if (!body) return;
            var by = sort ? sort.value : 'price';
            var query = plain(search ? search.value : '');
            rows.sort(function (x, y) {
                if (by === 'name') return x.getAttribute('data-name').localeCompare(y.getAttribute('data-name'), document.documentElement.lang || 'ar');
                return areas[y.getAttribute('data-slug')].values[typeKey][by] - areas[x.getAttribute('data-slug')].values[typeKey][by];
            });
            var shown = 0;
            rows.forEach(function (row) {
                body.appendChild(row);
                var match = (!query || plain(row.getAttribute('data-name')).indexOf(query) !== -1) && advMatch(row.getAttribute('data-slug'), adv);
                var visible = match && (expanded || query || advOn(adv) || shown < limit);
                if (match) shown++;
                row.hidden = !visible;
                if (visible) row.querySelector('[data-c="rank"]').textContent = shown;
            });
            if (empty) {
                empty.textContent = advOn(adv) ? data.advNone : data.noAreas;
                empty.classList.toggle('hidden', shown > 0);
            }
            if (more) more.classList.toggle('hidden', !!query || advOn(adv) || rows.length <= limit);
        }

        if (search) search.addEventListener('input', function () { arrange(); announce(); });
        if (sort) sort.addEventListener('change', function () { arrange(); announce(); });
        if (more) {
            more.addEventListener('click', function () {
                expanded = !expanded;
                more.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                more.querySelector('[data-label]').textContent = more.getAttribute(expanded ? 'data-less' : 'data-more');
                more.querySelector('svg').style.transform = expanded ? 'rotate(180deg)' : '';
                arrange();
                if (!expanded && section) section.scrollIntoView({ block: 'nearest' });
            });
        }

        // ---------- الأبرز هذا الشهر ----------
        function showMovers() {
            var field = { growth: 'yearly_text', yield: 'yield_text', demand: 'demand', value: 'price_range_text' };
            page.querySelectorAll('[data-movers]').forEach(function (list) {
                var kind = list.getAttribute('data-movers');
                var items = Array.prototype.slice.call(list.children);
                (data.movers[typeKey][kind] || []).forEach(function (slug, i) {
                    var item = items[i];
                    if (!item) return;
                    var name = item.querySelector('[data-mover-name]');
                    name.textContent = areas[slug].name;
                    if (areas[slug].url) name.setAttribute('href', areas[slug].url);
                    var values = areas[slug].values[typeKey];
                    item.querySelector('[data-mover-value]').textContent = values[field[kind]] != null ? values[field[kind]] : values.price_text;
                    // الأعلى طلبًا: الدايرة بتتملى على قد الرقم
                    var arc = item.querySelector('[data-mover-arc]');
                    if (arc) arc.setAttribute('stroke-dasharray', Math.max(0, Math.min(100, Number(values.demand) || 0)) + ' 100');
                });
            });
        }

        // ---------- ميزانيتك تجيب إيه ----------
        var budget = page.querySelector('[data-index-budget]');
        var budgetInput = budget ? budget.querySelector('[data-budget-input]') : null;
        function showBudget() {
            if (!budget || !budgetInput) return;
            var amount = digits(budgetInput.value);
            var list = budget.querySelector('[data-budget-results]');
            var none = budget.querySelector('[data-budget-empty]');
            // المساحة = المبلغ ÷ سعر المتر (للحساب بس، مش بتتعرض). بنعرض أغلى 6 مناطق المبلغ يجيب فيها 60 م² أو أكتر (أحسن منطقة تقدر عليها الأول)،
            // ولو مفيش: المناطق اللي يجيب فيها 40 م² على الأقل
            var all = data.areas.map(function (area) {
                var price = area.values[typeKey].price;
                return { area: area, price: price, size: Math.floor(amount / price) };
            });
            var options = all.filter(function (option) { return option.size >= 60; });
            if (!options.length) options = all.filter(function (option) { return option.size >= 40; });
            options = options.sort(function (x, y) { return y.price - x.price; }).slice(0, 6);
            list.textContent = '';
            options.forEach(function (option) {
                var item = document.createElement('li');
                item.className = 'index-budget__item card-stretch';
                // اسم المنطقة بس وجنبه صورتها (من غير سعر متر ولا مساحة). الصورة من صف المنطقة في لوحة الاختيار
                var row = page.querySelector('[data-index-picker] input[name="index-area-pick"][value="' + option.area.slug + '"]');
                var shown = row ? row.closest('label').querySelector('img') : null;
                if (shown) {
                    var image = document.createElement('img');
                    image.className = 'index-budget__image';
                    image.alt = '';
                    image.loading = 'lazy';
                    image.setAttribute('data-fallback', shown.getAttribute('data-fallback') || '');
                    image.onerror = function () { this.onerror = null; var spare = this.getAttribute('data-fallback'); if (spare) this.src = spare; else this.remove(); };   // من غير صورة بديلة: الصورة بتتشال بدل علامة الصورة المكسورة
                    image.src = shown.currentSrc || shown.getAttribute('src');
                    item.appendChild(image);
                }
                var name = document.createElement(option.area.url ? 'a' : 'span');
                if (option.area.url) name.setAttribute('href', option.area.url);
                name.className = 'index-budget__name' + (option.area.url ? ' card-link' : '');
                name.textContent = option.area.name;
                item.appendChild(name);
                list.appendChild(item);
            });
            none.classList.toggle('hidden', options.length > 0);
            budget.querySelectorAll('[data-budget-chip]').forEach(function (chip) {
                chip.setAttribute('aria-pressed', Number(chip.getAttribute('data-budget-chip')) === amount ? 'true' : 'false');
            });
        }
        if (budgetInput) {
            budgetInput.addEventListener('input', function () {
                var amount = digits(budgetInput.value);
                budgetInput.value = amount ? format(amount) : '';
                showBudget();
                announce();
            });
            budget.querySelectorAll('[data-budget-chip]').forEach(function (chip) {
                chip.addEventListener('click', function () {
                    budgetInput.value = format(chip.getAttribute('data-budget-chip'));
                    showBudget();
                    announce();
                });
            });
        }

        // ---------- حاسبة العائد ----------
        var calc = page.querySelector('[data-index-calc]');
        function field(name) { return calc ? calc.querySelector('[data-calc="' + name + '"]') : null; }
        function calcDefaults() {
            // النمو والعائد بيتملوا من أرقام المنطقة المختارة (والعميل يقدر يغيّرهم)
            var area = areas[field('area').value];
            if (!area) return;
            field('growth').value = area.values[typeKey].yearly;
            field('yield').value = area.values[typeKey].yield;
        }
        function showCalc() {
            if (!calc) return;
            var price = digits(field('price').value);
            var down = Math.min(100, digits(field('down').value)) / 100;
            var years = Math.max(1, digits(field('years').value));
            var hold = Math.max(1, digits(field('hold').value));
            var growth = digits(field('growth').value) / 100;
            var rentYield = digits(field('yield').value) / 100;
            var value = price * Math.pow(1 + growth, hold);
            var gain = value - price;
            var rent = price * rentYield * hold;
            var out = function (name, text) { var el = calc.querySelector('[data-calc-out="' + name + '"]'); if (el) el.textContent = text; };
            out('down', format(price * down) + ' ' + data.egp);
            out('installment', format(price * (1 - down) / (years * 12)) + ' ' + data.egp);
            out('value', format(value) + ' ' + data.egp);
            out('gain', format(gain) + ' ' + data.egp);
            out('rent', format(rent) + ' ' + data.egp);
            out('payback', rentYield > 0 ? (1 / rentYield).toFixed(1) + ' ' + data.yearsUnit : '—');
            out('total', price > 0 ? percent((gain + rent) / price * 100, 0) : '—');
            var label = calc.querySelector('[data-calc-label="value"]');
            if (label) label.textContent = data.outValue.replace(':years', hold);
        }
        if (calc) {
            calc.querySelectorAll('[data-calc]').forEach(function (input) {
                input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', function () {
                    if (input.getAttribute('data-calc') === 'area') calcDefaults();
                    if (input.getAttribute('data-calc') === 'price') {
                        var amount = digits(input.value);
                        input.value = amount ? format(amount) : '';
                    }
                    showCalc();
                });
            });
        }

        // ---------- قارن بين منطقتين ----------
        var compare = page.querySelector('[data-index-compare]');
        function picked(side) {
            var select = compare ? compare.querySelector('[data-compare-select="' + side + '"]') : null;
            return select ? select.value : '';
        }
        function showCompare() {
            if (!compare) return;
            var a = areas[picked('a')];
            var b = areas[picked('b')];
            if (!a || !b) return;
            compare.querySelectorAll('[data-compare-metric]').forEach(function (block) {
                var metric = block.getAttribute('data-compare-metric');
                var va = a.values[typeKey][metric];
                var vb = b.values[typeKey][metric];
                // الشريطين على نفس المقياس: من صفر لـ 100 (الطلب والمؤشر) أو لأكبر رقم في الاتنين (الباقي)
                var top = metric === 'demand' || metric === 'score' ? 100 : Math.max(Math.abs(va), Math.abs(vb)) || 1;
                [['a', a, va], ['b', b, vb]].forEach(function (entry) {
                    var value = entry[2];
                    block.querySelector('[data-compare-name="' + entry[0] + '"]').textContent = entry[1].name;
                    block.querySelector('[data-compare-fill="' + entry[0] + '"]').style.width = Math.max(2, Math.abs(value) / top * 100) + '%';
                    block.querySelector('[data-compare-value="' + entry[0] + '"]').textContent =
                        metric === 'price' || metric === 'resale' ? (entry[1].values[typeKey][metric + '_range_text'] || format(value)) : metric === 'yearly' ? percent(value) : metric === 'yield' ? value.toFixed(1) + '%' : value;
                });
            });
        }
        // نوع الوحدة في المقارنة [data-compare-type]: نفس اختيار الفلتر اللي فوق — الضغط هنا بيغيّر الفلتر (والصفحة كلها) ، وتغيير الفلتر بيعلّم هنا
        function markCompareType() {
            if (!compare) return;
            var label = '';
            compare.querySelectorAll('[data-compare-type]').forEach(function (chip) {
                var on = chip.getAttribute('data-compare-type') === typeKey;
                chip.setAttribute('aria-pressed', on ? 'true' : 'false');
                if (on) label = chip.textContent.trim();
            });
            if (label) compare.querySelectorAll('[data-compare-type-label]').forEach(function (node) { node.textContent = label; });
        }
        if (compare) {
            compare.querySelectorAll('[data-compare-select]').forEach(function (select) {
                select.addEventListener('change', function () { showCompare(); announce(); });
            });
            compare.querySelectorAll('[data-compare-type]').forEach(function (chip) {
                chip.addEventListener('click', function () {
                    var target = page.querySelector('[data-index-type="' + chip.getAttribute('data-compare-type') + '"]');
                    if (target) target.click();
                });
            });
        }

        // ---------- مليون جنيه من سنة بقوا كام؟ ----------
        function showAlternatives() {
            var holder = page.querySelector('[data-alt-rows]');
            var list = data.alternatives[typeKey] || [];
            if (!holder || !list.length) return;
            var top = Math.max.apply(null, list.map(function (item) { return item.rate; }));
            Array.prototype.slice.call(holder.children).forEach(function (row, i) {
                var item = list[i];
                if (!item) return;
                row.querySelector('span').textContent = item.label;
                row.querySelector('i').style.width = ((100 + item.rate) / (100 + top) * 100).toFixed(1) + '%';
                row.querySelector('b').textContent = format(1000000 * (1 + item.rate / 100));
            });
        }

        function announce() {
            page.dispatchEvent(new CustomEvent('shary:index-change', { bubbles: true, detail: {
                type: typeKey, area: areaKey, period: period, sort: sort ? sort.value : 'price', query: search ? search.value : '',
                a: picked('a'), b: picked('b'), budget: budgetInput ? digits(budgetInput.value) : 0, advanced: adv
            } }));
        }

        function show() {
            showMarket();
            fillRows();
            arrange();
            showMovers();
            showBudget();
            if (calc) { calcDefaults(); showCalc(); }
            showCompare();
            showAlternatives();
        }

        var buttons = Array.prototype.slice.call(page.querySelectorAll('[data-index-type]'));
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                buttons.forEach(function (other) { other.setAttribute('aria-pressed', other === button ? 'true' : 'false'); });
                typeKey = button.getAttribute('data-index-type');
                show();
                markCompareType();
                announce();
            });
        });
        var areaSelect = page.querySelector('[data-index-area]');
        if (areaSelect) {
            areaSelect.addEventListener('change', function () {
                areaKey = areaSelect.value;
                showMarket();
                announce();
            });
        }
        // ---------- الترتيب: زرار + قايمة تحته (نفس تصميم صفحة المنطقة). الاختيار بيتكتب في الـ select المخفي ----------
        var sortOpen = page.querySelector('[data-index-sort-open]');
        var sortMenu = page.querySelector('[data-index-sort-menu]');
        if (sortOpen && sortMenu && sort) {
            var closeSort = function () { sortMenu.classList.add('hidden'); sortOpen.setAttribute('aria-expanded', 'false'); };
            sortOpen.addEventListener('click', function () {
                var closed = sortMenu.classList.toggle('hidden');
                sortOpen.setAttribute('aria-expanded', closed ? 'false' : 'true');
                // علّم الاختيار الحالي كل مرة القايمة تتفتح
                sortMenu.querySelectorAll('input[type="radio"]').forEach(function (radio) { radio.checked = radio.value === sort.value; });
            });
            document.addEventListener('click', function (event) {
                if (!sortMenu.contains(event.target) && !sortOpen.contains(event.target)) closeSort();
            });
            sortMenu.querySelectorAll('input[type="radio"]').forEach(function (radio) {
                radio.addEventListener('change', function () {
                    sort.value = radio.value;
                    var label = page.querySelector('[data-index-sort-label]');
                    if (label) label.textContent = radio.parentNode.querySelector('span').textContent;
                    closeSort();
                    sort.dispatchEvent(new Event('change'));
                });
            });
        }

        // "غيّر المنطقة" جنب جدول الأنواع: بيفتح نفس قايمة مناطق الفلتر (من غير ما الصفحة تطلع لفوق)
        page.querySelectorAll('[data-index-area-open]').forEach(function (button) {
            button.addEventListener('click', function () {
                var hero = page.querySelector('[data-picker-open="hero"]');
                if (hero) hero.click();
            });
        });
        // "إزاي المؤشر بيتحسب": زراير الحسابات التلاتة (المنطقة / المشروع والوحدة / المطور)
        page.querySelectorAll('[data-index-method]').forEach(function (box) {
            var tabs = Array.prototype.slice.call(box.querySelectorAll('[data-method-tab]'));
            tabs.forEach(function (tab) {
                tab.addEventListener('click', function () {
                    var key = tab.getAttribute('data-method-tab');
                    tabs.forEach(function (other) { other.setAttribute('aria-pressed', other === tab ? 'true' : 'false'); });
                    box.querySelectorAll('[data-method-panel]').forEach(function (panel) { panel.classList.toggle('hidden', panel.getAttribute('data-method-panel') !== key); });
                });
            });
        });

        // ---------- جدول أنواع الوحدات: الضغط على النوع بيغيّر الصفحة كلها للنوع ده ويطلع للفلتر ----------
        page.querySelectorAll('[data-index-type-jump]').forEach(function (jump) {
            jump.addEventListener('click', function () {
                var target = page.querySelector('[data-index-type="' + jump.getAttribute('data-index-type-jump') + '"]');
                if (!target) return;
                target.click();
                var filter = page.querySelector('[data-index-filter]');
                if (filter) filter.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });

        // ---------- الفلتر المتقدم: لوحة بتصميم الموقع، الاختيارات مسودة لحد ما يضغط "اعرض" ----------
        var advDialog = page.querySelector('[data-index-advanced]');
        var advOpen = page.querySelector('[data-adv-open]');
        if (advDialog && advOpen) {
            var draft = { group: '', verdict: '', growth: 0, yield: 0 };
            var advChips = Array.prototype.slice.call(advDialog.querySelectorAll('[data-adv-chip]'));
            var advApply = advDialog.querySelector('[data-adv-apply]');
            var advActive = page.querySelector('[data-adv-active]');
            var chipValue = function (chip) {
                var key = chip.getAttribute('data-adv-chip'), value = chip.getAttribute('data-adv-value');
                return key === 'growth' || key === 'yield' ? Number(value) : value;
            };
            var paintDraft = function () {
                advChips.forEach(function (chip) { chip.setAttribute('aria-pressed', draft[chip.getAttribute('data-adv-chip')] === chipValue(chip) ? 'true' : 'false'); });
                var count = rows.filter(function (row) { return advMatch(row.getAttribute('data-slug'), draft); }).length;
                advApply.textContent = advApply.getAttribute('data-label').replace(':count', count);
            };
            var paintApplied = function () {
                var labels = advChips.filter(function (chip) { return chip.getAttribute('data-adv-label') && adv[chip.getAttribute('data-adv-chip')] === chipValue(chip); })
                    .map(function (chip) { return chip.getAttribute('data-adv-label'); });
                var badge = advOpen.querySelector('[data-adv-count]');
                if (badge) { badge.textContent = labels.length; badge.classList.toggle('hidden', !labels.length); }
                if (advActive) {
                    advActive.classList.toggle('hidden', !labels.length);
                    advActive.querySelector('[data-adv-summary]').textContent = labels.join(' · ');
                }
            };
            var closeAdv = function () { advDialog.classList.add('hidden'); document.documentElement.style.overflow = ''; advOpen.focus(); };
            advOpen.addEventListener('click', function () {
                draft = { group: adv.group, verdict: adv.verdict, growth: adv.growth, yield: adv.yield };
                paintDraft();
                advDialog.classList.remove('hidden');
                document.documentElement.style.overflow = 'hidden';
            });
            advChips.forEach(function (chip) {
                chip.addEventListener('click', function () { draft[chip.getAttribute('data-adv-chip')] = chipValue(chip); paintDraft(); });
            });
            advDialog.querySelectorAll('[data-adv-close]').forEach(function (button) { button.addEventListener('click', closeAdv); });
            advDialog.querySelector('[data-adv-reset]').addEventListener('click', function () { draft = { group: '', verdict: '', growth: 0, yield: 0 }; paintDraft(); });
            advApply.addEventListener('click', function () {
                adv = draft;
                arrange(); paintApplied(); closeAdv(); announce();
                if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            var advClear = page.querySelector('[data-adv-clear]');
            if (advClear) advClear.addEventListener('click', function () { adv = { group: '', verdict: '', growth: 0, yield: 0 }; arrange(); paintApplied(); announce(); });
            document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !advDialog.classList.contains('hidden')) closeAdv(); });
        }

        // ---------- أخبار السوق: تصفية بنوع الخبر (الكل / طروحات / أسعار / تسليمات / قرارات) ----------
        var newsFilters = page.querySelectorAll('[data-news-filter]');
        if (newsFilters.length) {
            var newsItems = page.querySelectorAll('[data-news-kind]');
            var newsEmpty = page.querySelector('[data-news-empty]');
            newsFilters.forEach(function (button) {
                button.addEventListener('click', function () {
                    var kind = button.getAttribute('data-news-filter');
                    var shown = 0;
                    newsFilters.forEach(function (other) { other.setAttribute('aria-pressed', other === button ? 'true' : 'false'); });
                    newsItems.forEach(function (item) {
                        var match = kind === 'all' || item.getAttribute('data-news-kind') === kind;
                        item.classList.toggle('hidden', !match);
                        if (match) shown += 1;
                    });
                    if (newsEmpty) newsEmpty.classList.toggle('hidden', shown > 0);
                    document.dispatchEvent(new CustomEvent('shary:news-filter', { detail: { kind: kind } }));
                });
            });
        }

        // ---------- لوحة اختيار المنطقة (نفس تصميم لوحات الاختيار في الموقع) ----------
        // أي زرار [data-picker-open] بيفتحها، والاختيار بيتكتب في الـ select المخفي اللي جنب الزرار وبيحدّث اسم الزرار
        var picker = page.querySelector('[data-index-picker]');
        if (picker) {
            var target = null;      // الزرار اللي فتح اللوحة
            var pickerSearch = picker.querySelector('[data-picker-search]');
            var options = Array.prototype.slice.call(picker.querySelectorAll('[data-picker-list] label'));
            var holder = function (button) { return button.parentNode.querySelector('select'); };
            // زرار الهيدر بيعرض صورة المنطقة + الاسم، وباقي الأزرار (المقارنة والحاسبة) الاسم بس
            var paint = function (button) {
                var slug = holder(button).value;
                var image = button.querySelector('[data-pick-image]');
                button.querySelector('[data-pick-name]').textContent = slug ? areas[slug].name : data.scopeAll;
                if (!image) return;
                if (!slug) {
                    image.src = image.getAttribute('data-all') || image.src;
                    image.classList.add('index-pick__mark');
                    return;
                }
                // الصورة بتتاخد من صف المنطقة في اللوحة نفسها
                var row = picker.querySelector('input[name="index-area-pick"][value="' + slug + '"]');
                var shown = row ? row.closest('label').querySelector('img') : null;
                var fallback = (shown && shown.getAttribute('data-fallback')) || areas[slug].image_fallback || '';
                image.classList.remove('index-pick__mark');
                image.setAttribute('data-fallback', fallback);
                image.onerror = function () { image.onerror = null; image.src = image.getAttribute('data-fallback'); };
                image.src = (shown && (shown.currentSrc || shown.getAttribute('src'))) || areas[slug].image || fallback;
            };
            var closePicker = function () {
                picker.classList.add('hidden');
                document.documentElement.style.overflow = '';
                if (target) { try { target.focus({ preventScroll: true }); } catch (error) { target.focus(); } }
                target = null;
            };
            page.querySelectorAll('[data-picker-open]').forEach(function (button) {
                var image = button.querySelector('[data-pick-image]');
                if (image && !holder(button).value) { image.setAttribute('data-all', image.getAttribute('src')); image.classList.add('index-pick__mark'); }
                button.addEventListener('click', function () {
                    target = button;
                    var value = holder(button).value;
                    var all = picker.querySelector('[data-picker-all]');
                    if (all) all.classList.toggle('hidden', !holder(button).querySelector('option[value=""]'));
                    options.forEach(function (row) { row.querySelector('input').checked = row.querySelector('input').value === value; if (row !== all) row.classList.remove('hidden'); });
                    if (pickerSearch) pickerSearch.value = '';
                    picker.classList.remove('hidden');
                    document.documentElement.style.overflow = 'hidden';
                });
            });
            options.forEach(function (row) {
                // click مش change: عشان اللوحة تتقفل حتى لو اختار نفس المنطقة المختارة
                row.querySelector('input').addEventListener('click', function () {
                    if (!target) return;
                    var select = holder(target);
                    select.value = row.querySelector('input').value;
                    paint(target);
                    closePicker();
                    select.dispatchEvent(new Event('change'));
                });
            });
            picker.querySelectorAll('[data-picker-close]').forEach(function (node) { node.addEventListener('click', closePicker); });
            document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !picker.classList.contains('hidden')) closePicker(); });
            if (pickerSearch) {
                pickerSearch.addEventListener('input', function () {
                    var query = plain(pickerSearch.value);
                    options.forEach(function (row) {
                        if (row.hasAttribute('data-picker-all') && target && !holder(target).querySelector('option[value=""]')) return;
                        row.classList.toggle('hidden', !!query && plain(row.querySelector('[data-picker-name]').textContent).indexOf(query) === -1);
                    });
                });
            }
        }

        var current = page.querySelector('[data-index-type][aria-pressed="true"]');
        if (current) typeKey = current.getAttribute('data-index-type');
        show();
    });
})();

/**
 * فرص إعادة بيع حصرية — القايمة (opportunities/index) وصفحة الفرصة (units/show + opportunities/partials/deal + market)
 *
 * 1) العدّاد [data-countdown="تاريخ الانتهاء ISO"]: النص بيتحدّث كل دقيقة من قوالب:
 *      data-countdown-days  = "متبقي :days أيام و :hours ساعات"
 *      data-countdown-hours = "متبقي :hours ساعات و :minutes دقيقة"   (آخر يوم)
 *      data-countdown-ended = "انتهت الفرصة"
 *
 * 2) فلتر القايمة [data-opps-filter] (المنطقة area[] / النوع type[] / السعر price = "من-إلى"):
 *    - أي تغيير بيطلع حدث shary:opportunities-filter على الفورم: detail = { area: [], type: [], price: '' }.
 *      امنعوه (preventDefault) لو هتجيبوا النتايج من السيرفر (AJAX) وبدّلوا الكروت بنفسكم.
 *    - لو ما اتمنعش: الكروت اللي في الصفحة [data-opp-card] بتتفلتر في مكانها (data-areas / data-type / data-price) والعدد [data-opps-count] بيتحدّث.
 *    - "مسح" [data-opps-reset] بيرجّع كل الاختيارات.
 *
 * 3) "قدّم عرضك" (طلب شراء): أي عنصر عليه [data-offer-open] بيفتح البوب أب [data-offer-modal] (opportunities/partials/offer-modal)،
 *    وبيتقفل من X أو الضغط براه أو Esc. الاسم والموبايل (مع كود الدولة) إجباري ، وقيمة العرض اختيارية.
 *    الإرسال بيطلع حدث shary:opportunity-offer على الفورم: detail = { slug, amount (0 = من غير قيمة), name, country_code, phone, done(), fail() }.
 *    لو ما اتمنعش: POST على action الفورم (JSON) وبعد الرد بتظهر رسالة التأكيد [data-offer-done] مكان الفورم.
 */
(function () {
    // ---- 1) العدّاد
    var timers = Array.prototype.slice.call(document.querySelectorAll('[data-countdown]'));
    function tick() {
        var now = Date.now();
        timers.forEach(function (node) {
            var end = Date.parse(node.getAttribute('data-countdown'));
            if (isNaN(end)) return;
            var left = Math.max(0, Math.floor((end - now) / 1000));
            if (!left) { node.textContent = node.getAttribute('data-countdown-ended') || ''; return; }
            var days = Math.floor(left / 86400), hours = Math.floor(left % 86400 / 3600), minutes = Math.floor(left % 3600 / 60);
            var template = node.getAttribute(days > 0 ? 'data-countdown-days' : 'data-countdown-hours') || '';
            if (!template) return;
            node.textContent = template.replace(':days', days).replace(':hours', hours).replace(':minutes', minutes);
        });
    }
    if (timers.length) { tick(); window.setInterval(tick, 60000); }

    // ---- السعر والتوفير الثابتين [data-opp-sticky] (موبايل): بيظهروا تحت الهيدر لما قسم السعر (.opp-deal) يطلع بره الشاشة
    document.querySelectorAll('[data-opp-sticky]').forEach(function (sticky) {
        var holder = sticky.closest('[data-opportunity-page]') || sticky.parentNode;
        var deal = holder.querySelector('.opp-deal') || document.querySelector('.opp-deal');
        if (!deal) return;
        var stickyHeader = sticky.closest('[lang]') ? sticky.closest('[lang]').querySelector('header') : document.querySelector('header');
        var placeSticky = function () {
            var box = deal.getBoundingClientRect();
            // الجزء الثابت لازق تحت الهيدر على طول
            var top = stickyHeader ? Math.max(0, stickyHeader.getBoundingClientRect().bottom) : 0;
            sticky.style.top = top + 'px';
            // ظاهر بس لما قسم السعر يعدّي فوق (والصفحة نفسها ظاهرة)
            sticky.classList.toggle('is-on', box.height > 0 && box.bottom < top + 10);
        };
        window.addEventListener('scroll', placeSticky, { passive: true });
        window.addEventListener('resize', placeSticky);
        placeSticky();
    });

    // ---- 2) فلتر القايمة
    document.querySelectorAll('[data-opps-filter]').forEach(function (form) {
        var page = form.closest('[data-opps-page]') || document;
        var apply = form.querySelector('[data-opps-apply]');
        var reset = form.querySelector('[data-opps-reset]');
        var selects = Array.prototype.slice.call(form.querySelectorAll('select'));
        var silent = false;
        if (apply) apply.classList.add('hidden');
        form.classList.add('is-live');

        function values() {
            var detail = {};
            selects.forEach(function (select) {
                var name = select.name.replace(/\[\]$/, '');
                detail[name] = select.multiple ? Array.prototype.filter.call(select.options, function (o) { return o.selected && o.value; }).map(function (o) { return o.value; }) : select.value;
            });
            return detail;
        }

        function filter(detail) {
            var cards = Array.prototype.slice.call(page.querySelectorAll('[data-opp-card]'));
            var range = String(detail.price || '').split('-');
            var low = range[0] ? Number(range[0]) : null, high = range[1] ? Number(range[1]) : null;
            var shown = 0;
            cards.forEach(function (card) {
                var areas = (card.getAttribute('data-areas') || '').split(' ');
                var price = Number(card.getAttribute('data-price')) || 0;
                var ok = (!(detail.area || []).length || detail.area.some(function (slug) { return areas.indexOf(slug) !== -1; })) &&
                    (!(detail.type || []).length || detail.type.indexOf(card.getAttribute('data-type')) !== -1) &&
                    (low === null || price >= low) && (high === null || price <= high);
                // الكارت جوه [data-opp-item]: مع الفلتر كل الفرص بتتعرض (من غير انتظار النزول) واللي مش مطابق بيختفي
                var item = card.closest('[data-opp-item]') || card;
                item.classList.remove('hidden', 'lg:block');
                item.classList.toggle('opp-out', !ok);
                if (ok) shown++;
            });
            var count = page.querySelector('[data-opps-count]');
            if (count) count.textContent = shown;
            var empty = page.querySelector('[data-opps-empty]');
            if (empty) empty.classList.toggle('hidden', shown > 0);
        }

        function send() {
            if (silent) return;
            var detail = values();
            var active = Object.keys(detail).some(function (key) { return detail[key] && detail[key].length; });
            if (reset) reset.classList.toggle('is-active', active);
            if (!form.dispatchEvent(new CustomEvent('shary:opportunities-filter', { bubbles: true, cancelable: true, detail: detail }))) return;
            filter(detail);
        }

        form.addEventListener('change', send);
        form.addEventListener('submit', function (event) { event.preventDefault(); send(); });
        if (reset) reset.addEventListener('click', function (event) {
            event.preventDefault();
            silent = true;
            selects.forEach(function (select) {
                if (select.multiple) Array.prototype.forEach.call(select.options, function (o) { o.selected = false; }); else select.value = '';
                select.dispatchEvent(new Event('change', { bubbles: true }));   // زرار القايمة بيتحدّث
            });
            silent = false;
            send();
        });
    });

    // ---- 3) قدّم عرضك (بوب أب)
    document.querySelectorAll('[data-offer-modal]').forEach(function (modal) {
        var form = modal.querySelector('[data-offer-form]');
        if (!form) return;
        var scope = modal.closest('[lang]') || document;
        var error = form.querySelector('[data-offer-error]');
        var done = modal.querySelector('[data-offer-done]');
        var amount = form.querySelector('[name="amount"]');
        var nameField = form.querySelector('[name="name"]');
        var lastOpener = null;

        function open(opener) {
            lastOpener = opener || null;
            // كل مرة يتفتح: الفورم ظاهر ورسالة التأكيد مخفية
            form.classList.remove('hidden');
            if (done) { done.classList.add('hidden'); done.classList.remove('flex'); }
            if (error) error.classList.add('hidden');
            modal.classList.remove('hidden');
            document.documentElement.classList.add('overflow-hidden');
            if (nameField && window.matchMedia('(min-width: 1024px)').matches) nameField.focus({ preventScroll: true });
        }

        function close() {
            if (modal.classList.contains('hidden')) return;
            modal.classList.add('hidden');
            document.documentElement.classList.remove('overflow-hidden');
            if (lastOpener && lastOpener.focus) lastOpener.focus({ preventScroll: true });
        }

        scope.addEventListener('click', function (event) {
            var opener = event.target.closest('[data-offer-open]');
            if (opener) { event.preventDefault(); open(opener); return; }
            if (event.target.closest('[data-offer-close]') && modal.contains(event.target)) close();
        });
        document.addEventListener('keydown', function (event) { if (event.key === 'Escape') close(); });

        // قيمة العرض: أرقام بس وبفواصل الآلاف
        if (amount) amount.addEventListener('input', function () {
            var digits = amount.value.replace(/[^\d]/g, '').replace(/^0+/, '');
            amount.value = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var code = form.querySelector('[name="country_code"]');
            var data = {
                slug: form.getAttribute('data-slug') || '',
                amount: Number((amount ? amount.value : '').replace(/[^\d]/g, '')) || 0,   // 0 = من غير قيمة (اختياري)
                name: (nameField.value || '').trim(),
                country_code: code ? code.value : '',
                phone: (form.querySelector('[name="phone"]').value || '').trim()
            };
            // الاسم والموبايل إجباري — قيمة العرض اختيارية
            var valid = data.name.length > 1 && data.phone.replace(/[^\d]/g, '').length >= 8;
            if (error) error.classList.toggle('hidden', valid);
            if (!valid) return;

            var button = form.querySelector('[type="submit"]');
            if (button) button.disabled = true;
            function finish() {
                if (button) button.disabled = false;
                form.reset();
                form.classList.add('hidden');
                if (done) { done.classList.remove('hidden'); done.classList.add('flex'); }
            }
            function fail() {
                if (button) button.disabled = false;
                if (error) error.classList.remove('hidden');
            }
            data.done = finish;
            data.fail = fail;
            if (!form.dispatchEvent(new CustomEvent('shary:opportunity-offer', { bubbles: true, cancelable: true, detail: data }))) return;

            var token = form.querySelector('[name="_token"]');
            fetch(form.getAttribute('action'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': token ? token.value : '' },
                body: JSON.stringify({ amount: data.amount || null, name: data.name, country_code: data.country_code, phone: data.phone })
            }).then(function (response) { if (!response.ok) throw new Error(response.status); finish(); }).catch(fail);
        });
    });
})();

/**
 * خريطة شاري التفاعلية (resources/views/map/show.blade.php)
 * - بتفتح على الكرة الأرضية (قمر صناعي) وبتقرّب بحركة: على المشروع المطلوب (data-focus="1") ، أو على المنطقة (data-area) ،
 *   وإلا بتقف على الكرة الأرضية فوق مصر وقايمة "اختر المنطقة" مفتوحة — واختيار منطقة بيطير عليها.
 * - اختيار مشروع [data-smap-item] (كارت أو علامة السعر على الخريطة) بيحرّك الخريطة على مكانه وبيظهر أزراره.
 * - "اختر المنطقة" [data-smap-areas-toggle] بيفتح القايمة الجلاسي [data-smap-areas] — بتتقفل بالضغط على أي مكان فاضي (الخريطة نفسها أو [data-smap-areas-close]) أو Esc.
 * - الشريط الأبيض: البحث [data-smap-search] ، "استلام فوري" [data-smap-ready] ، وزراير الفلاتر [data-smap-filter-open="types | delivery | price | (فاضي = الكل)"]
 *   بتفتح لوحة الفلاتر [data-smap-sheet] — الاختيارات [data-smap-f="types | delivery | price"] بتفلتر الكروت والعلامات فورًا.
 *   الفلتر عمره ما بيرجّع فاضي: لو مفيش مشروع مطابق بالظبط بيتعرض أقرب المشاريع (مع تنبيه صغير).
 * - أزرار الجنب: نوع الخريطة [data-smap-layers] (قمر صناعي ⇄ خريطة) ، كل المشاريع في الكادر [data-smap-reset] ، موقعي [data-smap-locate] ، تكبير / تصغير [data-smap-zoom].
 * - "عرض القائمة" [data-smap-list-link]: صفحة البحث على المنطقة المختارة (?area[]=) — التبديل وحدات ⇄ كمبوندات من جوه صفحة البحث.
 * - الاختيار بيطلع حدث shary:map-select على الصفحة: detail = بيانات المشروع. من أي كود: window.SharyMap.select('slug') / window.SharyMap.area('north-coast').
 * - زرار الرجوع [data-smap-back]: بيرجّع للصفحة اللي قبلها (ولو مفيش: لينك الزرار = الرئيسية).
 *
 * الخريطة نفسها (أول محرك متاح) — الاتنين نفس الـ API فالكود واحد:
 *   1) Mapbox GL (لو data-mapbox-token موجود ومكتبة mapboxgl محملة): نفس خريطة الموقع الحالية ، بالكرة الأرضية (projection: globe).
 *   2) MapLibre GL (من غير توكن): المكتبة بتتحمل لوحدها من data-gl-src (+ data-gl-css) ، كرة أرضية + صور قمر صناعي (Esri World Imagery) + أسماء الأماكن.
 *   علامة كل مشروع = اسمه المختصر في تابة صغيرة كحلي (المختار تركواز) — وعلى الكرة الأرضية قبل اختيار منطقة: نقط صغيرة.
 *   3) لو مفيش WebGL / المكتبة ما اتحملتش: تضمين خرائط جوجل بالقمر الصناعي على المشروع المختار (من غير أي مفتاح).
 */
(function () {
    var maps = [];
    var MAPBOX_STYLES = { h: 'mapbox://styles/mapbox/satellite-streets-v12', m: 'mapbox://styles/mapbox/streets-v12' };
    var ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/';
    var EGYPT = [30.2, 27.4];                     // [lng, lat] — نص مصر
    var START = { center: [8, 12], zoom: -0.6 };  // أول فتحة: الكرة الأرضية صغيرة من بعيد — وبتكبر بحركة ناعمة
    function easeOut(t) { return 1 - Math.pow(1 - t, 2.2); }
    var INTRO = 4600;   // مدة حركة الفتح (مللي ثانية) — نفس السرعة لخريطة مصر (الكرة الأرضية) وخريطة المنطقة (?area= — زي خريطة الساحل)

    // ستايل MapLibre (من غير توكن): كرة أرضية + قمر صناعي وأسماء الأماكن (h) أو خريطة الشوارع (m)
    function libreStyle(type) {
        var sources = type === 'h' ? {
            base: { type: 'raster', tiles: [ESRI + 'World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, maxzoom: 19, attribution: 'Imagery &copy; Esri' },
            labels: { type: 'raster', tiles: [ESRI + 'Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, maxzoom: 19 }
        } : {
            base: { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, maxzoom: 19, attribution: '&copy; OpenStreetMap' }
        };
        var layers = [{ id: 'ground', type: 'background', paint: { 'background-color': type === 'h' ? '#0d2238' : '#dfe9f3' } }, { id: 'base', type: 'raster', source: 'base' }];
        if (sources.labels) layers.push({ id: 'labels', type: 'raster', source: 'labels' });
        // السما حوالين الكرة: سحابي فاتح (مش أسود ولا كحلي) — نفس خلفية .smap__map
        return { version: 8, projection: { type: 'globe' }, sources: sources, layers: layers,
            sky: { 'sky-color': '#c3d6ee', 'horizon-color': '#ffffff', 'fog-color': '#ffffff', 'sky-horizon-blend': 0.7, 'horizon-fog-blend': 0.7, 'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 0.85, 5, 0.85, 7, 0] } };
    }

    document.querySelectorAll('[data-smap]').forEach(function (root) {
        var frame = root.querySelector('[data-smap-frame]');
        var glBox = root.querySelector('[data-smap-gl]');
        var items = Array.prototype.slice.call(root.querySelectorAll('[data-smap-item]'));
        var search = root.querySelector('[data-smap-search]');
        var empty = root.querySelector('[data-smap-empty]');
        var areasBox = root.querySelector('[data-smap-areas]');
        var areasToggle = root.querySelector('[data-smap-areas-toggle]');
        var areasVeil = root.querySelector('[data-smap-areas-close]');
        var areaLabel = root.querySelector('[data-smap-area-label]');
        var listLink = root.querySelector('[data-smap-list-link]');
        var counts = root.querySelectorAll('[data-smap-count]');
        var sheet = root.querySelector('[data-smap-sheet]');
        var note = root.querySelector('[data-smap-note]');
        var layersButton = root.querySelector('[data-smap-layers]');
        var lang = root.getAttribute('data-lang') || 'ar';
        var token = root.getAttribute('data-mapbox-token') || '';
        var state = {
            type: 'h', zoom: 16, current: null, live: false, intro: false,
            area: root.getAttribute('data-area') || '', focus: root.getAttribute('data-focus') === '1',
            types: [], delivery: [], price: ''
        };
        var gl = null, glLib = null, libState = '';   // المكتبة: '' لسه ، loading ، ready ، failed
        var noteTimer = null, meMarker = null;
        if (!frame || !items.length) return;

        function priceLabel(p) {
            return p.price_value ? (Math.round(p.price_value / 100000) / 10) + (root.getAttribute('data-million') || 'M') : '•';
        }

        function info(item) {
            if (!item.__project) { try { item.__project = JSON.parse(item.getAttribute('data-project')); } catch (e) { item.__project = {}; } }
            return item.__project;
        }

        function plain(text) {
            return String(text || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/\s+/g, ' ').trim();
        }

        function shown() { return items.filter(function (item) { return !item.parentNode.hidden; }); }

        function say(text) {
            if (!note || !text) return;
            note.textContent = text;
            note.hidden = false;
            clearTimeout(noteTimer);
            noteTimer = setTimeout(function () { note.hidden = true; }, 3800);
        }

        // الخروج من وضع "الكرة الأرضية" (أول ما العميل يختار منطقة / مشروع / فلتر): كروت المشاريع بتظهر
        function leaveGlobe() { root.classList.remove('is-globe'); }

        // ---- المكتبة: Mapbox (بتوكن — متحملة في الصفحة) أو MapLibre (بتتحمل لوحدها مرة واحدة)
        function loadLib() {
            if (libState) return;
            if (token) { libState = window.mapboxgl ? 'ready' : 'failed'; return; }
            if (window.maplibregl) { libState = 'ready'; return; }
            var src = root.getAttribute('data-gl-src');
            if (!src) { libState = 'failed'; return; }
            libState = 'loading';
            var done = function (ok) { if (libState !== 'loading') return; libState = ok && window.maplibregl ? 'ready' : 'failed'; paint(); };
            var css = root.getAttribute('data-gl-css');
            if (css) { var sheetLink = document.createElement('link'); sheetLink.rel = 'stylesheet'; sheetLink.href = css; document.head.appendChild(sheetLink); }
            var script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = function () { done(true); };
            script.onerror = function () { done(false); };
            document.head.appendChild(script);
            window.setTimeout(function () { done(false); }, 12000);
        }

        function bounds(list) {
            var box = new glLib.LngLatBounds();
            list.forEach(function (item) { var p = info(item); box.extend([p.lng, p.lat]); });
            return box;
        }

        // كل المشاريع الظاهرة في الكادر
        function fitAll(duration) {
            var list = shown();
            if (!gl || !list.length) return;
            var wide = window.matchMedia('(min-width: 1024px)').matches;
            gl.fitBounds(bounds(list), { padding: wide ? 90 : { top: 70, right: 46, bottom: 230, left: 46 }, maxZoom: 13.5, duration: duration || 1400, essential: true });
        }

        // ---- الخريطة: الكرة الأرضية + علامة سعر لكل مشروع
        function startGL() {
            if (gl) return true;
            var lib = token ? window.mapboxgl : window.maplibregl;
            if (!lib || !lib.Map || !glBox) return false;
            try {
                if (token) lib.accessToken = token;
                glBox.hidden = false;
                glBox.setAttribute('dir', 'ltr');
                var options = { container: glBox, style: token ? MAPBOX_STYLES[state.type] : libreStyle(state.type), center: START.center, zoom: START.zoom, minZoom: -1, attributionControl: false };
                if (token) options.projection = 'globe';
                gl = new lib.Map(options);
                glLib = lib;
                if (lib.AttributionControl) gl.addControl(new lib.AttributionControl({ compact: true }), 'bottom-left');
                // Mapbox: السما ورا الكرة سحابي فاتح بدل الأسود
                if (token) gl.on('style.load', function () { try { gl.setFog({ color: '#ffffff', 'high-color': '#c3d6ee', 'space-color': '#cfe0f3', 'horizon-blend': 0.08, 'star-intensity': 0 }); } catch (e) { /* نسخة أقدم من غير الغلاف الجوي */ } });
                items.forEach(function (item) {
                    var p = info(item);
                    var pin = document.createElement('button');
                    pin.type = 'button';
                    pin.className = 'smap__marker';
                    pin.setAttribute('aria-label', p.name || '');
                    // اسم المشروع المختصر (من غير "كمبوند / قرية / Compound") جوه تابة صغيرة — السعر في الـ title
                    var label = document.createElement('span');
                    label.textContent = String(p.name || '').replace(/^(كمبوند|قرية|مشروع|Compound|Village)\s+/i, '') || priceLabel(p);
                    pin.appendChild(label);
                    pin.title = (p.name || '') + ' — ' + priceLabel(p);
                    pin.addEventListener('click', function (event) { event.stopPropagation(); select(item, true); });
                    pin.style.display = item.parentNode.hidden ? 'none' : '';
                    item.__pin = pin;
                    item.__marker = new lib.Marker({ element: pin, anchor: 'bottom' }).setLngLat([p.lng, p.lat]).addTo(gl);
                });
                // الضغط على أي مكان فاضي في الخريطة بيقفل قايمة المناطق
                gl.on('click', function () { toggleAreas(false); });
                var started = false;
                var begin = function () { if (started) return; started = true; intro(); };
                gl.on('load', function () { window.setTimeout(begin, 350); });
                window.setTimeout(begin, 2200);   // لو صور الخريطة اتأخرت: الحركة بتبدأ برضه
                frame.hidden = true;
                root.classList.add('is-gl');
                return true;
            } catch (error) {
                gl = null;
                if (glBox) glBox.hidden = true;
                return false;
            }
        }

        // أول حركة بعد ما الخريطة تفتح: من الكرة الأرضية للمشروع / المنطقة — أو تقريب بسيط على مصر والقايمة مفتوحة
        function intro() {
            state.intro = true;
            if (state.focus && state.current) {
                var p = info(state.current);
                leaveGlobe();
                gl.flyTo({ center: [p.lng, p.lat], zoom: 14.5, duration: INTRO + 600, essential: true });
                return;
            }
            if (state.area) { leaveGlobe(); fitAll(INTRO); return; }
            // الكرة بتيجي من بعيد وتكبر بالراحة لحد ما تقف فوق مصر — وبعدها قايمة "اختر المنطقة" بتنزل
            gl.easeTo({ center: EGYPT, zoom: window.matchMedia('(min-width: 1024px)').matches ? 2.6 : 1.9, duration: INTRO, easing: easeOut, essential: true });
            window.setTimeout(function () { if (root.classList.contains('is-globe') && !state.area && !state.current) toggleAreas(true); }, INTRO - 1400);
        }

        // الخريطة بتتحدّث لما تبقى ظاهرة بس (ولما المشروع / النوع / التكبير يتغيّر)
        function paint(fly) {
            if (!state.live) return;
            loadLib();
            if (libState === 'loading') return;   // مستنيين المكتبة
            if (libState === 'ready' && startGL()) {
                items.forEach(function (item) { if (item.__pin) item.__pin.classList.toggle('is-on', item === state.current); });
                if (fly !== false && state.intro && state.current) {
                    var p = info(state.current);
                    gl.flyTo({ center: [p.lng, p.lat], zoom: Math.max(13, Math.min(18, state.zoom)), duration: 1600, essential: true });
                }
                return;
            }
            // من غير WebGL: تضمين خرائط جوجل على المشروع المختار (أو أول مشروع ظاهر)
            var item = state.current || shown()[0] || items[0];
            var q = info(item);
            frame.hidden = false;
            leaveGlobe();
            var url = 'https://www.google.com/maps?q=' + q.lat + ',' + q.lng + '&t=' + state.type + '&z=' + state.zoom + '&hl=' + lang + '&output=embed';
            if (frame.getAttribute('src') !== url) frame.setAttribute('src', url);
            frame.setAttribute('title', (root.getAttribute('data-frame-title') || '').replace(':name', q.name || ''));
        }

        function select(item, reveal) {
            state.current = item || null;
            items.forEach(function (other) { other.setAttribute('aria-current', other === item ? 'true' : 'false'); });
            if (!item) { paint(false); return; }
            if (state.intro || !gl) leaveGlobe();
            paint();
            if (reveal) {
                // الكارت المختار يبان في القايمة (بالعرض على الموبايل / بالطول على الديسك توب) من غير ما الصفحة تتحرك
                var list = item.closest('[data-smap-list]');
                var row = item.parentNode;
                if (list && list.scrollWidth > list.clientWidth + 4) list.scrollTo({ left: row.offsetLeft - (list.clientWidth - row.offsetWidth) / 2, behavior: 'smooth' });
                else if (list && list.scrollHeight > list.clientHeight + 4) list.scrollTo({ top: row.offsetTop - list.offsetTop - 8, behavior: 'smooth' });
            }
            root.dispatchEvent(new CustomEvent('shary:map-select', { bubbles: true, detail: info(item) }));
        }

        // ---- الفلترة: المنطقة + البحث + أنواع الوحدات + التسليم + السعر. لو مفيش مطابق بالظبط: بنفك الشروط واحد واحد لحد ما يبقى فيه نتيجة
        function matches(item, use) {
            var p = info(item);
            if (state.area && item.getAttribute('data-area') !== state.area) return false;
            if (use.words && use.words.length) {
                if (!item.__hay) item.__hay = plain([p.name, p.developer_name, p.area_label, p.group_label, p.location, p.slug].join(' '));
                if (!use.words.every(function (word) { return item.__hay.indexOf(word) > -1; })) return false;
            }
            if (use.types && state.types.length && !(p.type_keys || []).some(function (key) { return state.types.indexOf(key) > -1; })) return false;
            if (use.delivery && state.delivery.length && state.delivery.indexOf(String(p.delivery)) === -1) return false;
            if (use.price && state.price !== '') {
                var chip = root.querySelector('[data-smap-f="price"][data-value="' + state.price + '"]');
                var min = chip ? Number(chip.getAttribute('data-min')) : 0, max = chip ? Number(chip.getAttribute('data-max')) : 0;
                if (p.price_value < min || (max && p.price_value > max)) return false;
            }
            return true;
        }

        function filter(keep) {
            var words = plain(search && search.value).split(' ').filter(Boolean);
            var levels = [
                { words: words, types: 1, delivery: 1, price: 1 },
                { words: words, types: 1, delivery: 1 },
                { words: words, types: 1 },
                { words: words },
                {}
            ];
            var list = [], level = 0;
            for (; level < levels.length; level++) {
                list = items.filter(function (item) { return matches(item, levels[level]); });
                if (list.length) break;
            }
            if (!list.length) { list = items.slice(); }
            if (level > 0) say(root.getAttribute('data-closest'));
            items.forEach(function (item) {
                var ok = list.indexOf(item) > -1;
                item.parentNode.hidden = !ok;
                if (item.__pin) item.__pin.style.display = ok ? '' : 'none';
            });
            if (empty) empty.classList.add('hidden');
            Array.prototype.forEach.call(counts, function (count) { count.textContent = list.length; });
            if (listLink) listLink.setAttribute('href', (root.getAttribute('data-search-url') || '#') + (state.area ? '?area[]=' + state.area : ''));
            // شارات عدد الاختيارات على زراير الفلاتر
            [['types', state.types.length], ['delivery', state.delivery.length], ['price', state.price !== '' ? 1 : 0]].forEach(function (pair) {
                var badge = root.querySelector('[data-smap-fcount="' + pair[0] + '"]');
                if (badge) { badge.textContent = pair[1]; badge.hidden = !pair[1]; badge.parentNode.classList.toggle('is-set', !!pair[1]); }
            });
            var ready = root.querySelector('[data-smap-ready]');
            if (ready) ready.setAttribute('aria-pressed', state.delivery.length === 1 && state.delivery[0] === '0' ? 'true' : 'false');
            if (keep) return;
            if (state.current && list.indexOf(state.current) === -1) select(null);
            leaveGlobe();
            if (gl) { if (state.intro) fitAll(); }
            else { if (!state.current) select(list[0], true); else paint(); }
        }

        function setArea(slug) {
            state.area = slug;
            root.querySelectorAll('[data-smap-area]').forEach(function (chip) {
                var on = chip.getAttribute('data-smap-area') === slug;
                chip.setAttribute('aria-pressed', on ? 'true' : 'false');
                if (on && areaLabel) areaLabel.textContent = chip.getAttribute('data-label') || '';
            });
            if (areasToggle) areasToggle.classList.toggle('is-set', !!slug);
        }

        function toggleAreas(open) {
            if (!areasBox) return;
            areasBox.hidden = !open;
            if (areasVeil) areasVeil.hidden = !open;   // طبقة شفافة فوق الخريطة: الضغط على أي مكان فاضي بيقفل القايمة
            if (areasToggle) areasToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        }

        // ---- لوحة الفلاتر: section = types | delivery | price | '' (الكل)
        function toggleSheet(open, section) {
            if (!sheet) return;
            sheet.hidden = !open;
            if (!open) return;
            toggleAreas(false);
            sheet.querySelectorAll('[data-smap-fsec]').forEach(function (part) { part.hidden = !!section && part.getAttribute('data-smap-fsec') !== section; });
        }

        function paintChips() {
            root.querySelectorAll('[data-smap-f]').forEach(function (chip) {
                var kind = chip.getAttribute('data-smap-f'), value = chip.getAttribute('data-value');
                var on = kind === 'price' ? state.price === value : state[kind].indexOf(value) > -1;
                chip.setAttribute('aria-pressed', on ? 'true' : 'false');
            });
        }

        items.forEach(function (item) {
            item.addEventListener('click', function (event) { if (!event.target.closest('a')) select(item, true); });
            item.addEventListener('keydown', function (event) { if ((event.key === 'Enter' || event.key === ' ') && event.target === item) { event.preventDefault(); select(item, true); } });
        });

        if (areasToggle) areasToggle.addEventListener('click', function () { toggleAreas(areasBox.hidden); });
        if (areasVeil) areasVeil.addEventListener('click', function () { toggleAreas(false); });
        document.addEventListener('keydown', function (event) { if (event.key === 'Escape') { toggleAreas(false); toggleSheet(false); } });
        document.addEventListener('click', function (event) {
            if (areasBox && !areasBox.hidden && !event.target.closest('[data-smap-areas], [data-smap-areas-toggle]')) toggleAreas(false);
        });
        root.querySelectorAll('[data-smap-area]').forEach(function (chip) {
            chip.addEventListener('click', function () { setArea(chip.getAttribute('data-smap-area')); toggleAreas(false); filter(); });
        });

        // زرار الرجوع: الصفحة اللي قبلها (لو جاي من صفحة في الموقع) — وإلا لينك الزرار (الرئيسية)
        var back = root.querySelector('[data-smap-back]');
        if (back) back.addEventListener('click', function (event) {
            if (window.history.length > 1 && document.referrer && document.referrer.indexOf(window.location.host) > -1) { event.preventDefault(); window.history.back(); }
        });

        if (search) search.addEventListener('input', function () { filter(); });

        root.querySelectorAll('[data-smap-filter-open]').forEach(function (button) {
            button.addEventListener('click', function () { toggleSheet(true, button.getAttribute('data-smap-filter-open')); });
        });
        root.querySelectorAll('[data-smap-sheet-close]').forEach(function (button) {
            button.addEventListener('click', function () { toggleSheet(false); });
        });
        root.querySelectorAll('[data-smap-f]').forEach(function (chip) {
            chip.addEventListener('click', function () {
                var kind = chip.getAttribute('data-smap-f'), value = chip.getAttribute('data-value');
                if (kind === 'price') state.price = state.price === value ? '' : value;
                else { var at = state[kind].indexOf(value); if (at > -1) state[kind].splice(at, 1); else state[kind].push(value); }
                paintChips();
                filter();
            });
        });
        var clear = root.querySelector('[data-smap-fclear]');
        if (clear) clear.addEventListener('click', function () { state.types = []; state.delivery = []; state.price = ''; paintChips(); filter(); });
        // "استلام فوري": المشاريع اللي فيها وحدات جاهزة بس
        var readyButton = root.querySelector('[data-smap-ready]');
        if (readyButton) readyButton.addEventListener('click', function () {
            state.delivery = state.delivery.length === 1 && state.delivery[0] === '0' ? [] : ['0'];
            paintChips();
            filter();
        });

        // نوع الخريطة: قمر صناعي ⇄ خريطة
        if (layersButton) layersButton.addEventListener('click', function () {
            state.type = state.type === 'h' ? 'm' : 'h';
            layersButton.setAttribute('data-type', state.type);
            layersButton.classList.toggle('is-on', state.type === 'm');
            root.classList.toggle('is-roadmap', state.type === 'm');
            if (gl) gl.setStyle(token ? MAPBOX_STYLES[state.type] : libreStyle(state.type));
            else paint();
        });

        root.querySelectorAll('[data-smap-zoom]').forEach(function (button) {
            button.addEventListener('click', function () {
                var step = Number(button.getAttribute('data-smap-zoom'));
                if (gl) { if (step > 0) gl.zoomIn(); else gl.zoomOut(); return; }
                state.zoom = Math.max(9, Math.min(20, state.zoom + step));
                paint();
            });
        });

        // "كل المشاريع في الكادر"
        var reset = root.querySelector('[data-smap-reset]');
        if (reset) reset.addEventListener('click', function () {
            toggleAreas(false);
            leaveGlobe();
            if (gl) fitAll(); else { state.zoom = 12; paint(); }
        });

        // "موقعي": الخريطة بتروح لمكان العميل (بعد إذن المتصفح)
        var locate = root.querySelector('[data-smap-locate]');
        if (locate) locate.addEventListener('click', function () {
            var fail = function () { say(root.getAttribute('data-locate-fail')); };
            if (!navigator.geolocation || !gl) { fail(); return; }
            navigator.geolocation.getCurrentPosition(function (position) {
                var here = [position.coords.longitude, position.coords.latitude];
                toggleAreas(false);
                leaveGlobe();
                if (!meMarker) { var dot = document.createElement('span'); dot.className = 'smap__me'; meMarker = new glLib.Marker({ element: dot }).setLngLat(here).addTo(gl); } else meMarker.setLngLat(here);
                gl.flyTo({ center: here, zoom: 12, duration: 2200, essential: true });
            }, fail, { enableHighAccuracy: false, timeout: 8000 });
        });

        function bySlug(slug) { return items.filter(function (item) { return item.getAttribute('data-slug') === slug; })[0]; }

        // البداية: فلتر المنطقة (لو موجود) + المشروع المطلوب (لو اللينك جاي عليه)
        if (state.area) setArea(state.area);
        if (state.focus) { state.current = bySlug(root.getAttribute('data-selected')) || null; if (state.current) state.current.setAttribute('aria-current', 'true'); }
        if (state.focus || state.area) leaveGlobe();
        filter(true);

        if ('IntersectionObserver' in window) {
            // أول ما الخريطة تظهر بتتحمل — ولو اتخفت ورجعت (صفحة واحدة بأكتر من عرض) بنظبط مقاسها
            new IntersectionObserver(function (entries) {
                if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
                if (!state.live) { state.live = true; paint(); return; }
                if (gl && gl.resize) gl.resize();
            }, { rootMargin: '200px' }).observe(frame.parentNode);
        } else { state.live = true; paint(); }

        maps.push({
            root: root,
            area: function (slug) { setArea(slug); filter(); },
            select: function (slug) {
                var item = bySlug(slug);
                if (!item) return false;
                if (item.parentNode.hidden) { if (search) search.value = ''; setArea(''); state.types = []; state.delivery = []; state.price = ''; paintChips(); filter(true); }
                toggleAreas(false);
                state.focus = true;
                select(item, true);
                return true;
            }
        });
    });

    window.SharyMap = {
        // بيفلتر الخريطة الظاهرة على منطقة (slug المنطقة الرئيسية) — '' = كل المناطق
        area: function (slug) {
            var visible = maps.filter(function (map) { return map.root.offsetParent !== null; });
            (visible.length ? visible : maps).forEach(function (map) { map.area(slug || ''); });
        },
        // بيختار المشروع في الخريطة الظاهرة (أو أول خريطة)
        select: function (slug) {
            var visible = maps.filter(function (map) { return map.root.offsetParent !== null; });
            return (visible.length ? visible : maps).some(function (map) { return map.select(slug); });
        }
    };
})();

/**
 * قوايم الكروت في الموقع كله (مشاريع المنطقة / مشاريع المطور / الإيجار / العروض / التريندي / القوايم الجاهزة):
 *
 * من غير أرقام صفحات ولا "عرض المزيد" — موبايل وديسك توب: القايمة بتكمّل لوحدها وأنت نازل (زي صفحة البحث).
 *   - القايمة اللي عليها data-auto-more="3": شغالة على الموبايل والديسك توب.
 *     موبايل: الأول بتظهر الكروت المتحملة والمخفية على الموبايل (class="hidden lg:block") 3 بـ 3 ، وبعدها بتطلب الصفحة اللي بعدها.
 *     ديسك توب: كروت الصفحة الأولى كلها ظاهرة ، ولما العميل ينزل بتطلب الصفحة اللي بعدها وتضيف كروتها تحت.
 *   - القايمة اللي عليها data-auto-desktop (مشاريع المنطقة): ديسك توب بس (الموبايل عليه زرار "شوف الكل").
 *   لينك الصفحة اللي بعدها: data-next-url على [data-pagination] (أرقام الصفحات نفسها مخفية — blog/partials/pagination).
 *   حدث shary:load-more ({ url, append(nodes, nextUrl) }): امنعوه لو هتجيبوا الكروت بطريقتكم ونادوا append.
 *   العنصر [data-auto-sentinel] تحت القايمة: data-state="idle | loading | done".
 *
 * (تبديل الصفحات بالأرقام [data-pagination] a لسه مدعوم لو حد رجّع الأرقام ، بس هي مخفية دلوقتي.)
 * (شريط الإعلانات [data-ad-strip] في js/shary/site-chrome.js عشان يشتغل في كل الصفحات.)
 *
 * السيرفر مش محتاج endpoint جديد: نفس الصفحة بـ ?page=N، والسكربت بياخد منها القايمة ولينك اللي بعدها.
 */
(function () {
    if (!window.fetch || !window.DOMParser) return;

    var GRID = '[data-projects-grid], [data-articles-grid], [data-results]';
    var desktop = window.matchMedia('(min-width: 1024px)');

    function usable(url) { return !!url && url.charAt(0) !== '#'; }

    // القايمة اللي تبع أرقام الصفحات دي: أقرب عنصر فوقها جواه قايمة كروت
    function gridOf(nav) {
        var box = nav.parentNode;
        while (box && box.querySelector) {
            var grid = box.querySelector(GRID);
            if (grid) return grid;
            box = box.parentNode;
        }
        return null;
    }

    function navs(doc) { return Array.prototype.slice.call(doc.querySelectorAll('[data-pagination]')); }

    function load(url) {
        return fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            .then(function (response) { if (!response.ok) throw new Error(response.status); return response.text(); })
            .then(function (html) { return new DOMParser().parseFromString(html, 'text/html'); });
    }

    function copies(grid) {
        return Array.prototype.map.call(grid ? grid.children : [], function (node) { return document.importNode(node, true); });
    }

    // بعد تبديل الكروت: لو أول القايمة فوق الشاشة ننزّلها بهدوء لأول كارت — من غير ما نرجع لأول الصفحة
    function settle(grid) {
        var top = grid.getBoundingClientRect().top;
        if (top < 96) window.scrollTo({ top: window.pageYOffset + top - 120, behavior: 'smooth' });
    }

    // ---------- ديسك توب: تبديل الكروت مكانها ----------
    function swap(nav, url, push) {
        var grid = gridOf(nav);
        if (!grid || grid.__busy) return;
        var index = navs(document).indexOf(nav);
        grid.__busy = true;
        grid.classList.add('listing-loading');

        var detail = {
            url: url,
            replace: function (nodes, paginationHtml, nextUrl) {
                grid.textContent = '';
                Array.prototype.slice.call(nodes || []).forEach(function (node) { grid.appendChild(node); });
                if (typeof paginationHtml === 'string') nav.innerHTML = paginationHtml;
                nav.setAttribute('data-next-url', nextUrl || '');
                if (window.SharyCards) window.SharyCards.refresh(grid);
                grid.__busy = false;
                grid.classList.remove('listing-loading');
                if (push) history.pushState({ sharyListing: true }, '', url);
                settle(grid);
            }
        };
        if (!nav.dispatchEvent(new CustomEvent('shary:page', { bubbles: true, cancelable: true, detail: detail }))) return;

        load(url)
            .then(function (page) {
                var nextNav = navs(page)[index];
                var nextGrid = nextNav ? gridOf(nextNav) : null;
                if (!nextGrid) throw new Error('no list');
                detail.replace(copies(nextGrid), nextNav.innerHTML, nextNav.getAttribute('data-next-url'));
            })
            .catch(function () { window.location.href = url; });
    }

    document.addEventListener('click', function (event) {
        var link = event.target.closest ? event.target.closest('[data-pagination] a[href]') : null;
        if (!link || event.defaultPrevented || !desktop.matches) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button) return;   // فتح في تاب جديد يفضل عادي
        var url = link.getAttribute('href');
        if (!usable(url)) return;
        event.preventDefault();
        swap(link.closest('[data-pagination]'), link.href, true);
    });

    // زرار الرجوع في المتصفح بعد تبديل الصفحات
    window.addEventListener('popstate', function () {
        var nav = navs(document)[0];
        if (nav && desktop.matches && (history.state && history.state.sharyListing || nav.__turned)) swap(nav, window.location.href, false);
    });
    document.addEventListener('shary:page', function (event) { event.target.__turned = true; });

    // ---------- القايمة بتكمّل لوحدها وأنت نازل (موبايل وديسك توب) ----------
    var AUTO = '[data-auto-more], [data-auto-desktop]';
    document.querySelectorAll(AUTO).forEach(function (grid) {
        var mobileToo = grid.hasAttribute('data-auto-more');   // data-auto-desktop لوحدها = ديسك توب بس
        var step = parseInt(grid.getAttribute('data-auto-more'), 10) || 3;
        var box = grid.parentNode;
        var sentinel = box.querySelector('[data-auto-sentinel]');
        if (!sentinel) return;
        var gridIndex = Array.prototype.indexOf.call(document.querySelectorAll(AUTO), grid);
        var busy = false;
        var observer = null;

        function state(name) { sentinel.setAttribute('data-state', name); }
        // الكروت المتحملة والمخفية على الموبايل — على الديسك توب هي ظاهرة أصلًا
        function waiting() { return desktop.matches ? [] : Array.prototype.slice.call(grid.querySelectorAll(':scope > .hidden.lg\\:block')); }
        function nextUrl() { var nav = box.querySelector('[data-pagination]'); return nav ? nav.getAttribute('data-next-url') || '' : ''; }

        function finish() {
            state('done');
            sentinel.classList.add('hidden');
            if (observer) { observer.disconnect(); observer = null; }
        }

        function near() {
            var rect = sentinel.getBoundingClientRect();
            return rect.width + rect.height > 0 && rect.top < window.innerHeight + 300;
        }

        function again() {
            busy = false;
            if (!waiting().length && !usable(nextUrl())) { finish(); return; }
            state('idle');
            setTimeout(function () { if (near()) more(); }, 80);
        }

        function more() {
            if (busy || (!desktop.matches && !mobileToo)) return;
            var hidden = waiting();
            if (hidden.length) {
                busy = true;
                state('loading');
                setTimeout(function () {
                    hidden.slice(0, step).forEach(function (card) { card.classList.remove('hidden', 'lg:block'); });
                    again();
                }, 350);
                return;
            }
            var url = nextUrl();
            if (!usable(url)) { finish(); return; }
            busy = true;
            state('loading');
            var detail = {
                url: url,
                append: function (nodes, next) {
                    Array.prototype.slice.call(nodes || []).forEach(function (node) {
                        node.classList.remove('hidden', 'lg:block');
                        grid.appendChild(node);
                    });
                    var nav = box.querySelector('[data-pagination]');
                    if (nav) nav.setAttribute('data-next-url', next || '');
                    if (window.SharyCards) window.SharyCards.refresh(grid);
                    again();
                }
            };
            if (!grid.dispatchEvent(new CustomEvent('shary:load-more', { bubbles: true, cancelable: true, detail: detail }))) return;
            load(url)
                .then(function (page) {
                    var incoming = page.querySelectorAll(AUTO)[gridIndex];
                    var nav = incoming ? incoming.parentNode.querySelector('[data-pagination]') : null;
                    detail.append(copies(incoming), nav ? nav.getAttribute('data-next-url') : '');
                })
                .catch(function () { busy = false; finish(); });
        }

        if (!waiting().length && !usable(nextUrl())) { finish(); return; }
        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver(function (entries) { if (entries[0].isIntersecting) more(); }, { rootMargin: '300px 0px' });
            observer.observe(sentinel);
        } else {
            window.addEventListener('scroll', function () { if (near()) more(); });
        }
    });
})();

/**
 * صفحة المدونة — موبايل وديسك توب: من غير أرقام صفحات.
 * لما المستخدم يوصل لآخر المقالات بتتحمل الصفحة التالية وتتضاف تحتها تلقائي (زي صفحة البحث).
 * بيعتمد على لينك الصفحة التالية الموجود في data-next-url على عنصر ترقيم الصفحات [data-pagination] (العنصر نفسه مخفي).
 * حدث shary:load-more ({ url, append(nodes, nextUrl) }) على [data-articles-grid]: امنعوه لو هتجيبوا المقالات بطريقتكم ونادوا append.
 */
(function () {
    if (!window.fetch || !('IntersectionObserver' in window)) return;
    var separator = ['mt-7', 'border-t', 'border-shary-line', 'pt-7', 'md:mt-0', 'md:border-t-0', 'md:pt-0'];

    function usable(url) { return !!url && url.charAt(0) !== '#'; }

    Array.prototype.forEach.call(document.querySelectorAll('[data-articles-grid]'), function (grid, gridIndex) {
        var pager = grid.parentNode.querySelector('[data-pagination]');
        if (!pager) return;
        var next = pager.getAttribute('data-next-url') || '';
        if (!usable(next)) return;
        var loading = false;

        var sentinel = document.createElement('div');
        sentinel.setAttribute('aria-hidden', 'true');
        grid.insertAdjacentElement('afterend', sentinel);

        function append(nodes, nextUrl) {
            Array.prototype.slice.call(nodes || []).forEach(function (item) {
                var card = item.ownerDocument === document ? item : document.importNode(item, true);
                separator.forEach(function (name) { card.classList.add(name); });
                grid.appendChild(card);
            });
            next = nextUrl || '';
            loading = false;
            if (!usable(next)) observer.disconnect();
        }

        var observer = new IntersectionObserver(function (entries) {
            if (!entries[0].isIntersecting || loading) return;
            loading = true;
            var detail = { url: next, append: append };
            if (!grid.dispatchEvent(new CustomEvent('shary:load-more', { bubbles: true, cancelable: true, detail: detail }))) return;

            fetch(next, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
                .then(function (response) { return response.ok ? response.text() : Promise.reject(); })
                .then(function (html) {
                    var page = new DOMParser().parseFromString(html, 'text/html');
                    var more = page.querySelectorAll('[data-articles-grid]')[gridIndex];
                    var nextPager = more ? more.parentNode.querySelector('[data-pagination]') : null;
                    append(more ? more.children : [], nextPager ? nextPager.getAttribute('data-next-url') || '' : '');
                })
                .catch(function () { observer.disconnect(); });
        }, { rootMargin: '400px' });

        observer.observe(sentinel);
    });
})();

/**
 * صفحة وحدة الإيجار (rent/show.blade.php):
 * - المعرض [data-rent-gallery]: الضغط على صورة [data-gallery-item] بيخليها الصورة المفتوحة (data-active="1").
 *   لو الصورة مفتوحة بالفعل بيتفتح عارض الصور عليها.
 * - عارض الصور [data-rent-lightbox]: أي زرار [data-lightbox-open="gallery | floor | master"] بيفتحه على صور المجموعة دي
 *   (الصور اللي عليها data-lightbox-item بنفس الاسم). بنفس شكل تطبيق شاري: X + عدّاد "1 / 5"، وصف صور صغيرة تحت للمعرض،
 *   ومخطط الوحدة جوه كارت أبيض. السحب / الأسهم / الكيبورد بتقلّب، و X أو الضغط بره أو Esc بيقفل.
 * - التكبير (الصور / الماستر بلان / مخطط الوحدة) باليد على الموبايل: بصباعين (pinch) — التكبير بيحصل عند مكان الصوابع والصورة بتتحرك معاها
 *   يمين / شمال / فوق / تحت في نفس الوقت ، وبعد التكبير صباع واحد بيحرّك الصورة في أي اتجاه. ضغطتين ورا بعض بيكبّروا مكان الضغطة.
 *   زراير + / − [data-lightbox-zoom] وعجلة الماوس اختياريين. التقليب بالسحب بيشتغل والصورة بحجمها الطبيعي بس. الصورة بترجع لحجمها مع كل صورة جديدة.
 */
(function () {
    document.querySelectorAll('[data-rent-lightbox]').forEach(function (box) {
        var scope = box.closest('main') || document;
        var view = box.querySelector('[data-lightbox-image]');
        var counter = box.querySelector('[data-lightbox-count]');
        var thumbs = box.querySelector('[data-lightbox-thumbs]');
        var arrows = box.querySelectorAll('[data-lightbox-prev], [data-lightbox-next]');
        var items = [];
        var at = 0;
        var opener = null;
        var frame = box.querySelector('[data-lightbox-frame]') || view;
        var zoom = { scale: 1, x: 0, y: 0 };   // تكبير الصورة المفتوحة ومكانها

        function applyZoom(smooth) {
            // الصورة ما تخرجش بره الشاشة: أقصى حركة = نص الزيادة في المقاس
            var maxX = Math.max(0, (zoom.scale - 1) * frame.offsetWidth / 2), maxY = Math.max(0, (zoom.scale - 1) * frame.offsetHeight / 2);
            zoom.x = Math.max(-maxX, Math.min(maxX, zoom.x));
            zoom.y = Math.max(-maxY, Math.min(maxY, zoom.y));
            frame.style.transition = smooth ? 'transform 0.22s ease' : 'none';
            frame.style.transform = zoom.scale === 1 ? '' : 'translate(' + zoom.x + 'px, ' + zoom.y + 'px) scale(' + zoom.scale + ')';
            box.classList.toggle('is-zoomed', zoom.scale > 1);
        }

        function setZoom(scale, smooth) {
            zoom.scale = Math.max(1, Math.min(4, scale));
            if (zoom.scale === 1) { zoom.x = 0; zoom.y = 0; }
            applyZoom(smooth);
        }

        function show(index) {
            if (!items.length) return;
            at = (index + items.length) % items.length;
            setZoom(1, false);
            var source = items[at];
            view.src = source.currentSrc || source.getAttribute('src');
            view.alt = source.getAttribute('alt') || '';
            counter.textContent = (at + 1) + ' / ' + items.length;
            Array.prototype.forEach.call(thumbs.children, function (thumb, i) { thumb.setAttribute('aria-current', i === at ? 'true' : 'false'); });
            var current = thumbs.children[at];
            if (current && current.scrollIntoView) current.scrollIntoView({ block: 'nearest', inline: 'center' });
        }

        // group: gallery = صور الوحدة (صف صور صغيرة تحت) ، floor = مخطط الوحدة (جوه كارت أبيض) ، master = المخطط العام
        function open(group, index, from) {
            items = Array.prototype.slice.call(scope.querySelectorAll('[data-lightbox-item="' + group + '"]'));
            if (!items.length) return;
            opener = from || null;
            box.setAttribute('data-group', group);
            thumbs.textContent = '';
            if (group === 'gallery' && items.length > 1) {
                items.forEach(function (source, i) {
                    var thumb = document.createElement('button');
                    thumb.type = 'button';
                    var image = document.createElement('img');
                    image.src = source.currentSrc || source.getAttribute('src');
                    image.alt = '';
                    thumb.appendChild(image);
                    thumb.addEventListener('click', function () { show(i); });
                    thumbs.appendChild(thumb);
                });
            }
            thumbs.classList.toggle('hidden', !thumbs.children.length);
            counter.classList.toggle('hidden', group === 'floor');
            arrows.forEach(function (button) { button.classList.toggle('lg:flex', items.length > 1); });
            show(index || 0);
            box.classList.remove('hidden');
            document.documentElement.style.overflow = 'hidden';
        }

        function close() {
            setZoom(1, false);
            box.classList.add('hidden');
            document.documentElement.style.overflow = '';
            if (opener) opener.focus();
        }

        scope.querySelectorAll('[data-lightbox-open]').forEach(function (button) {
            button.addEventListener('click', function () { open(button.getAttribute('data-lightbox-open'), 0, button); });
        });
        box.querySelectorAll('[data-lightbox-close]').forEach(function (button) { button.addEventListener('click', close); });
        box.querySelector('[data-lightbox-prev]').addEventListener('click', function () { show(at - 1); });
        box.querySelector('[data-lightbox-next]').addEventListener('click', function () { show(at + 1); });
        // اللمس: صباع واحد = تقليب (أو تحريك الصورة لو مكبّرة) ، صباعين = تكبير / تصغير ، ضغطتين ورا بعض = تكبير / رجوع
        var startX = null, pinch = null, drag = null, lastTap = 0, moving = false;
        function spread(touches) { return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY); }
        function middle(touches) { return { x: (touches[0].clientX + touches[1].clientX) / 2, y: (touches[0].clientY + touches[1].clientY) / 2 }; }
        // مركز الصورة على الشاشة من غير الحركة (علشان التكبير يحصل عند مكان الصوابع)
        function home() { var rect = frame.getBoundingClientRect(); return { x: rect.left + rect.width / 2 - zoom.x, y: rect.top + rect.height / 2 - zoom.y }; }
        // تكبير عند نقطة على الشاشة: النقطة دي بتفضل تحت الصباع
        function zoomAt(scale, point, smooth) {
            var base = home(), before = zoom.scale;
            scale = Math.max(1, Math.min(4, scale));
            zoom.x = (point.x - base.x) - ((point.x - base.x) - zoom.x) * (scale / before);
            zoom.y = (point.y - base.y) - ((point.y - base.y) - zoom.y) * (scale / before);
            setZoom(scale, smooth);
        }
        function startDrag(touch) { drag = { x: touch.clientX - zoom.x, y: touch.clientY - zoom.y }; startX = null; }
        box.addEventListener('touchstart', function (event) {
            if (event.touches.length === 2) {
                var mid = middle(event.touches), base = home();
                pinch = { distance: spread(event.touches) || 1, scale: zoom.scale, x: mid.x - base.x - zoom.x, y: mid.y - base.y - zoom.y, base: base };
                startX = null; drag = null; moving = true;
                return;
            }
            var touch = event.touches[0];
            moving = false;
            if (zoom.scale > 1) startDrag(touch);
            else startX = touch.clientX;
        }, { passive: true });
        box.addEventListener('touchmove', function (event) {
            if (pinch && event.touches.length === 2) {
                // صباعين: تكبير / تصغير عند مكان الصوابع + الصورة بتتحرك مع الصوابع في أي اتجاه
                event.preventDefault();
                var mid = middle(event.touches);
                var scale = Math.max(1, Math.min(4, pinch.scale * spread(event.touches) / pinch.distance));
                zoom.x = (mid.x - pinch.base.x) - pinch.x * (scale / pinch.scale);
                zoom.y = (mid.y - pinch.base.y) - pinch.y * (scale / pinch.scale);
                setZoom(scale, false);
                return;
            }
            if (drag && event.touches.length === 1) {
                // صباع واحد والصورة مكبّرة: الصورة بتمشي مع الصباع يمين / شمال / فوق / تحت
                event.preventDefault(); moving = true;
                zoom.x = event.touches[0].clientX - drag.x; zoom.y = event.touches[0].clientY - drag.y; applyZoom(false);
            }
        }, { passive: false });
        box.addEventListener('touchend', function (event) {
            if (pinch) {
                if (event.touches.length < 2) {
                    pinch = null;
                    if (zoom.scale < 1.08) setZoom(1, true);
                    // صباع لسه على الشاشة بعد التكبير: يكمل تحريك الصورة على طول
                    else if (event.touches.length === 1) startDrag(event.touches[0]);
                }
                return;
            }
            if (event.target.closest && event.target.closest('button, a')) { startX = null; drag = null; return; }
            // ضغطتين ورا بعض على الصورة: تكبير عند مكان الضغطة / رجوع
            var now = Date.now();
            var moved = startX === null ? 0 : event.changedTouches[0].clientX - startX;
            if (!moving && Math.abs(moved) < 12 && event.target.closest && event.target.closest('[data-lightbox-frame]')) {
                if (now - lastTap < 320) {
                    lastTap = 0;
                    if (zoom.scale > 1) setZoom(1, true);
                    else zoomAt(2.5, { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }, true);
                    startX = null; drag = null; return;
                }
                lastTap = now;
            }
            drag = null;
            if (startX === null) return;
            startX = null;
            if (Math.abs(moved) < 45 || items.length < 2 || zoom.scale > 1) return;
            var rtl = !!box.closest('[dir="rtl"]');
            show(at + ((moved < 0) === rtl ? -1 : 1));
        });
        // التكبير للصورة بس: المتصفح ما يكبّرش الصفحة / الخلفية / صف الصور الصغيرة (iOS: gesturestart)
        ['gesturestart', 'gesturechange', 'gestureend'].forEach(function (name) { box.addEventListener(name, function (event) { event.preventDefault(); }, { passive: false }); });
        // ديسك توب: عجلة الماوس بتكبّر ، ضغطتين بيكبّروا / يرجّعوا ، والسحب بيحرّك الصورة المكبّرة
        box.addEventListener('wheel', function (event) {
            if (!event.target.closest || !event.target.closest('[data-lightbox-stage], [data-lightbox-frame]')) return;
            event.preventDefault();
            setZoom(zoom.scale * (event.deltaY < 0 ? 1.15 : 0.87), false);
        }, { passive: false });
        frame.addEventListener('dblclick', function () { setZoom(zoom.scale > 1 ? 1 : 2.5, true); });
        var mouse = null;
        frame.addEventListener('mousedown', function (event) { if (zoom.scale > 1) { mouse = { x: event.clientX - zoom.x, y: event.clientY - zoom.y }; event.preventDefault(); } });
        document.addEventListener('mousemove', function (event) { if (!mouse) return; zoom.x = event.clientX - mouse.x; zoom.y = event.clientY - mouse.y; applyZoom(false); });
        document.addEventListener('mouseup', function () { mouse = null; });
        box.querySelectorAll('[data-lightbox-zoom]').forEach(function (button) {
            button.addEventListener('click', function () { setZoom(zoom.scale + Number(button.getAttribute('data-lightbox-zoom')) * 0.75, true); });
        });
        document.addEventListener('keydown', function (event) {
            if (box.classList.contains('hidden')) return;
            var rtl = !!box.closest('[dir="rtl"]');
            if (event.key === 'Escape') close();
            else if (event.key === 'ArrowLeft') show(at + (rtl ? 1 : -1));
            else if (event.key === 'ArrowRight') show(at + (rtl ? -1 : 1));
        });

        // المعرض: الصورة المضغوطة بتبقى المفتوحة، ولو مفتوحة بالفعل بيتفتح العارض عليها
        scope.querySelectorAll('[data-rent-gallery]').forEach(function (root) {
            var tiles = Array.prototype.slice.call(root.querySelectorAll('[data-gallery-item]'));
            tiles.forEach(function (tile, index) {
                tile.addEventListener('click', function () {
                    if (tile.getAttribute('data-active') === '1') { open('gallery', index, tile); return; }
                    tiles.forEach(function (other) { other.setAttribute('data-active', other === tile ? '1' : '0'); });
                });
            });
        });
    });
})();

/**
 * صفحة الوحدة (units/show.blade.php) وصفحة المشروع (projects/show.blade.php):
 *
 * - مؤشرات الاستثمار [data-insights] (property/partials/insights.blade.php):
 *   البيانات في <script type="application/json" data-insight-data> بنفس شكل $insights.
 *   التبويب [data-insight-tab="unfinished | finished"] بيبدّل الرسم وأرقام الإيجار وإعادة البيع
 *   ([data-insight="monthly | yield | after | profit"]) من غير تحميل.
 *   الرسم [data-insight-chart] (زي التطبيق): خطين ناعمين (بعد الاستلام / سعر السوق)، وعلى كل خط سنة معلّمة بعمود ملوّن وقيمتها بالمليون:
 *   sets[..].delivery = سنة الاستلام على خط "بعد الاستلام" ، sets[..].market_mark = السنة المعلّمة على خط "سعر السوق" (اختياري).
 *   الماوس أو الصباع على الرسم بيظهر أرقام السنة.
 *   الجدول [data-insight-table] (sr-only) بيتحدّث مع التبويب لقارئ الشاشة.
 *   لو البيانات اتغيرت بعد التحميل: window.SharyProperty.refresh(root) بيعيد قراية البيانات ويرسم من جديد.
 *
 * - شريط الملخص [data-prop-bar] (property/partials/summary-bar.blade.php): بيفضل ثابت تحت الهيدر وأنت نازل.
 *   ديسك توب: الشريط كله. موبايل: سطر السعر (.prop-bar__prices) بس — السكربت بيحسب المكان من ارتفاع الهيدر. وهو ثابت بياخد class="is-stuck".
 *
 * - المعرض [data-gallery-slider] (partials/photo-gallery.blade.php مع slider): على الموبايل صورة واحدة بتتسحب بالجنب وتحتها نقط.
 *   الصور بتتقلّب لوحدها كل 4.5 ثانية (موبايل وديسك توب)، وبتقف وقت ما العميل ماسكها أو عارض الصور مفتوح.
 *
 * - وحدات المشروع [data-project-units] (data-per-page = عدد الكروت في الصفحة على الديسك توب):
 *   كل كروت المشروع [data-unit] موجودة في [data-project-grid]، وعلى كل كارت: data-sale ، data-invest ، data-types ، data-beds ، data-baths ، data-size ،
 *   data-finishing ، data-delivery ، data-years ، data-price ، data-installment ، data-order.
 *   التبويب [data-unit-tab=" | developer | resale | invest"] بيظهر كروت النوع ده بس.
 *   "تصفية" والترتيب: نفس فورم فلاتر الموقع (areas/partials/filters.blade.php مع projectFilters) — صفحة الفلاتر بتفتح من js/shary/area-page.js،
 *   و"عرض النتائج" بيفلتر كروت الصفحة هنا من غير تحميل (type[] ، bedrooms[] ، bathrooms[] ، finishing[] ، delivery[] ، years[] ، السعر ، المساحة ، sort).
 *   من غير أرقام صفحات ولا "عرض المزيد" — الوحدات بتكمّل لوحدها وأنت نازل ([data-units-sentinel]):
 *   موبايل: 3 كروت في المرة. ديسك توب: صفحة كاملة (data-per-page = 9) في المرة.
 *   حدث shary:project-units ({ tab, sort, filters, url }) قبل التبديل: امنعوه (preventDefault) لو هتجيبوا الكروت من السيرفر بطريقتكم،
 *   وبعد ما تحطوا الكروت الجديدة في [data-project-grid] نادوا section.__renderUnits().
 */
(function () {
    var UNIT_COLOR = '#2A9D8F';     // بعد الاستلام
    var MARKET_COLOR = '#E9A23B';   // سعر السوق
    var INK = '#123A5C';
    var MUTED = '#5B6B7C';
    var GRID = '#E4E9EF';
    var NS = 'http://www.w3.org/2000/svg';

    function el(name, attrs, parent) {
        var node = document.createElementNS(NS, name);
        Object.keys(attrs || {}).forEach(function (key) { node.setAttribute(key, attrs[key]); });
        if (parent) parent.appendChild(node);
        return node;
    }

    function money(value) {
        return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function millions(value) {
        return (Math.round(value / 100000) / 10).toFixed(1);
    }

    // أرقام محور السعر: 4 خطوط بفرق "مريح" (0.5 / 1 / 2 / 5 مليون ...)
    function ticks(min, max) {
        var span = Math.max(max - min, 1);
        var raw = span / 4;
        var pow = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
        var step = [1, 2, 2.5, 5, 10].map(function (m) { return m * pow; }).filter(function (s) { return s >= raw; })[0];
        var from = Math.floor(min / step) * step;
        var out = [];
        for (var v = from; v < max + step; v += step) out.push(v);
        return out;
    }

    // خط ناعم بيعدّي على كل النقط من غير ما يطلع أو ينزل عن قيمها (monotone cubic)
    function smooth(points) {
        var n = points.length;
        if (n < 3) return points.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
        var slopes = [], tangents = [], i;
        for (i = 0; i < n - 1; i++) slopes.push((points[i + 1][1] - points[i][1]) / (points[i + 1][0] - points[i][0]));
        tangents.push(slopes[0]);
        for (i = 1; i < n - 1; i++) tangents.push(slopes[i - 1] * slopes[i] <= 0 ? 0 : (slopes[i - 1] + slopes[i]) / 2);
        tangents.push(slopes[n - 2]);
        for (i = 0; i < n - 1; i++) {
            if (slopes[i] === 0) { tangents[i] = 0; tangents[i + 1] = 0; continue; }
            var a = tangents[i] / slopes[i], b = tangents[i + 1] / slopes[i], h = a * a + b * b;
            if (h > 9) { var t = 3 / Math.sqrt(h); tangents[i] = t * a * slopes[i]; tangents[i + 1] = t * b * slopes[i]; }
        }
        var d = 'M' + points[0][0].toFixed(1) + ' ' + points[0][1].toFixed(1);
        for (i = 0; i < n - 1; i++) {
            var dx = (points[i + 1][0] - points[i][0]) / 3;
            d += ' C' + (points[i][0] + dx).toFixed(1) + ' ' + (points[i][1] + tangents[i] * dx).toFixed(1) + ' ' +
                (points[i + 1][0] - dx).toFixed(1) + ' ' + (points[i + 1][1] - tangents[i + 1] * dx).toFixed(1) + ' ' +
                points[i + 1][0].toFixed(1) + ' ' + points[i + 1][1].toFixed(1);
        }
        return d;
    }

    function draw(section) {
        var state = section.__insights;
        var box = section.querySelector('[data-insight-chart]');
        if (!state || !box) return;
        var set = state.data.sets[state.tab];
        var years = state.data.years;
        if (!set || !years || !years.length) return;
        var width = Math.round(box.clientWidth);
        if (!width) return;   // الصفحة مخفية دلوقتي — هيترسم أول ما تظهر
        var height = width < 480 ? 230 : 280;
        var pad = { top: 34, right: 18, bottom: 32, left: 34 };
        var all = set.unit.concat(set.market);
        var scale = ticks(Math.min.apply(null, all), Math.max.apply(null, all));
        var low = scale[0], high = scale[scale.length - 1];
        var plotW = width - pad.left - pad.right;
        var plotH = height - pad.top - pad.bottom;
        var floor = height - pad.bottom;
        var last = years.length - 1;
        function x(i) { return pad.left + (last > 0 ? plotW * i / last : plotW / 2); }
        function y(v) { return pad.top + plotH * (1 - (v - low) / (high - low)); }
        function line(values) { return smooth(values.map(function (v, i) { return [x(i), y(v)]; })); }
        function clamp(i) { return Math.max(0, Math.min(last, i)); }

        box.textContent = '';
        var svg = el('svg', { viewBox: '0 0 ' + width + ' ' + height, width: width, height: height, role: 'img', 'aria-label': box.getAttribute('data-alt') || '' }, box);
        var defs = el('defs', {}, svg);
        function gradient(name, color, from, to) {
            var id = 'prop-' + name + '-' + state.id;
            var grad = el('linearGradient', { id: id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
            el('stop', { offset: '0', 'stop-color': color, 'stop-opacity': from }, grad);
            el('stop', { offset: '1', 'stop-color': color, 'stop-opacity': to }, grad);
            return 'url(#' + id + ')';
        }
        var areaFill = gradient('area', UNIT_COLOR, 0.16, 0);
        var unitBar = gradient('unit', UNIT_COLOR, 0.08, 0.6);
        var marketBar = gradient('market', MARKET_COLOR, 0.08, 0.6);

        // السنة المعلّمة على كل خط: الاستلام على خط "بعد الاستلام" ، و market_mark على خط "سعر السوق"
        var d = clamp(set.delivery);
        var marks = [{ at: d, value: set.unit[d], color: UNIT_COLOR, bar: unitBar, ink: '#1F7F72' }];
        if (set.market_mark != null && clamp(set.market_mark) !== d) {
            var m = clamp(set.market_mark);
            marks.unshift({ at: m, value: set.market[m], color: MARKET_COLOR, bar: marketBar, ink: '#B7770D' });
        }

        // خطوط المحور وأرقامه (مليون)
        scale.forEach(function (v) {
            el('line', { x1: pad.left, x2: width - pad.right, y1: y(v), y2: y(v), stroke: GRID, 'stroke-width': 1 }, svg);
            var label = el('text', { x: pad.left - 8, y: y(v) + 4, 'text-anchor': 'end', 'font-size': 11, 'font-weight': 600, fill: MUTED }, svg);
            label.textContent = millions(v).replace(/\.0$/, '');
        });

        // العمود الملوّن تحت كل نقطة معلّمة + مربع سنتها على المحور
        marks.forEach(function (mark) {
            el('rect', { x: x(mark.at) - 12, y: y(mark.value), width: 24, height: floor - y(mark.value), fill: mark.bar, rx: 3 }, svg);
            el('rect', { x: x(mark.at) - 17, y: floor + 5, width: 34, height: 19, rx: 5, fill: mark.color, opacity: 0.22 }, svg);
        });
        years.forEach(function (year, i) {
            var marked = marks.some(function (mark) { return mark.at === i; });
            var label = el('text', { x: x(i), y: floor + 18.5, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': marked ? 800 : 600, fill: marked ? INK : MUTED }, svg);
            label.textContent = !marked && width < 360 && i % 2 ? '' : year;
        });

        // المساحة تحت خط "بعد الاستلام" + الخطين
        el('path', { d: line(set.unit) + ' L' + x(last).toFixed(1) + ' ' + floor + ' L' + x(0).toFixed(1) + ' ' + floor + ' Z', fill: areaFill }, svg);
        el('path', { d: line(set.market), fill: 'none', stroke: MARKET_COLOR, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);
        el('path', { d: line(set.unit), fill: 'none', stroke: UNIT_COLOR, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);

        // النقطة المعلّمة: خط رأسي + نقطة + القيمة بالمليون جنبها
        marks.forEach(function (mark) {
            var px = x(mark.at), py = y(mark.value);
            el('line', { x1: px, x2: px, y1: py, y2: floor, stroke: INK, 'stroke-width': 1.5 }, svg);
            el('circle', { cx: px, cy: py, r: 5, fill: INK, stroke: '#fff', 'stroke-width': 2 }, svg);
            var text = millions(mark.value);
            var w = text.length * 7.2 + 14;
            var left = px - 10 - w >= pad.left;   // القيمة على شمال النقطة، ولو مفيش مكان تبقى على يمينها
            var bx = left ? px - 10 - w : px + 10;
            var by = Math.max(4, py - 24);
            el('rect', { x: bx, y: by, width: w, height: 20, rx: 6, fill: '#fff', stroke: mark.color, 'stroke-width': 1 }, svg);
            var label = el('text', { x: bx + w / 2, y: by + 14, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: mark.ink }, svg);
            label.textContent = text;
        });
        // اسم علامة الاستلام فوق عمودها
        var caption = el('text', { x: x(d), y: 12, 'text-anchor': d === 0 ? 'start' : d === last ? 'end' : 'middle', 'font-size': 11, 'font-weight': 700, fill: MUTED }, svg);
        caption.textContent = box.getAttribute('data-label-delivery') || '';

        // الماوس / الصباع: خط رأسي + نقطتين + كارت فيه أرقام السنة
        var cross = el('line', { y1: pad.top - 6, y2: floor, stroke: INK, 'stroke-width': 1, opacity: 0 }, svg);
        var dotUnit = el('circle', { r: 5, fill: UNIT_COLOR, stroke: '#fff', 'stroke-width': 2, opacity: 0 }, svg);
        var dotMarket = el('circle', { r: 5, fill: MARKET_COLOR, stroke: '#fff', 'stroke-width': 2, opacity: 0 }, svg);
        var tip = document.createElement('div');
        tip.className = 'prop-chart__tip';
        tip.hidden = true;
        var page = box.parentNode.closest ? box.parentNode.closest('[dir]') : null;
        tip.setAttribute('dir', page ? page.getAttribute('dir') : 'ltr');
        box.appendChild(tip);
        var egp = box.getAttribute('data-label-egp') || '';

        function row(color, name, value) {
            var line = document.createElement('p');
            var key = document.createElement('i');
            key.style.backgroundColor = color;
            var text = document.createElement('span');
            text.textContent = name;
            var number = document.createElement('b');
            number.setAttribute('dir', 'ltr');
            number.textContent = money(value);
            var unit = document.createElement('small');
            unit.textContent = egp;
            line.appendChild(key); line.appendChild(text); line.appendChild(number); line.appendChild(unit);
            return line;
        }

        function show(i) {
            cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i)); cross.setAttribute('opacity', 0.35);
            dotUnit.setAttribute('cx', x(i)); dotUnit.setAttribute('cy', y(set.unit[i])); dotUnit.setAttribute('opacity', 1);
            dotMarket.setAttribute('cx', x(i)); dotMarket.setAttribute('cy', y(set.market[i])); dotMarket.setAttribute('opacity', 1);
            tip.textContent = '';
            var head = document.createElement('strong');
            head.textContent = years[i] + (i === d ? ' · ' + (box.getAttribute('data-label-delivery') || '') : '');
            tip.appendChild(head);
            tip.appendChild(row(UNIT_COLOR, box.getAttribute('data-label-unit') || '', set.unit[i]));
            tip.appendChild(row(MARKET_COLOR, box.getAttribute('data-label-market') || '', set.market[i]));
            tip.hidden = false;
            var half = tip.offsetWidth / 2;
            tip.style.left = Math.max(half, Math.min(width - half, x(i))) + 'px';
            tip.style.top = Math.max(0, Math.min(y(set.unit[i]), y(set.market[i])) - tip.offsetHeight - 12) + 'px';
        }
        function hide() {
            cross.setAttribute('opacity', 0); dotUnit.setAttribute('opacity', 0); dotMarket.setAttribute('opacity', 0);
            tip.hidden = true;
        }
        function at(event) {
            var rect = svg.getBoundingClientRect();
            var point = event.touches ? event.touches[0] : event;
            var ratio = (point.clientX - rect.left - pad.left) / plotW;
            show(clamp(Math.round(ratio * last)));
        }
        svg.addEventListener('mousemove', at);
        svg.addEventListener('mouseleave', hide);
        svg.addEventListener('touchstart', at, { passive: true });
        svg.addEventListener('touchmove', at, { passive: true });
        svg.addEventListener('touchend', function () { setTimeout(hide, 1600); });
    }

    function fill(section) {
        var state = section.__insights;
        var set = state.data.sets[state.tab];
        if (!set) return;
        var values = { monthly: set.rental.monthly, yield: set.rental.yield, after: set.resale.after, profit: set.resale.profit };
        Object.keys(values).forEach(function (key) {
            var node = section.querySelector('[data-insight="' + key + '"]');
            if (node) node.textContent = values[key];
        });
        section.querySelectorAll('[data-insight-tab]').forEach(function (button) {
            button.setAttribute('aria-pressed', button.getAttribute('data-insight-tab') === state.tab ? 'true' : 'false');
        });
        var body = section.querySelector('[data-insight-table] tbody');
        if (body) {
            body.textContent = '';
            state.data.years.forEach(function (year, i) {
                var tr = document.createElement('tr');
                var th = document.createElement('th');
                th.setAttribute('scope', 'row');
                th.textContent = year;
                tr.appendChild(th);
                [set.unit[i], set.market[i]].forEach(function (value) {
                    var td = document.createElement('td');
                    td.textContent = money(value);
                    tr.appendChild(td);
                });
                body.appendChild(tr);
            });
        }
        draw(section);
    }

    var counter = 0;
    function setup(section) {
        var source = section.querySelector('[data-insight-data]');
        if (!source) return;
        var data;
        try { data = JSON.parse(source.textContent); } catch (error) { return; }
        var first = !section.__insights;
        var tab = first ? (data.tabs && data.tabs[0] ? data.tabs[0].key : Object.keys(data.sets)[0]) : section.__insights.tab;
        section.__insights = { data: data, tab: tab, id: first ? ++counter : section.__insights.id };
        fill(section);
        if (!first) return;
        section.querySelectorAll('[data-insight-tab]').forEach(function (button) {
            button.addEventListener('click', function () {
                section.__insights.tab = button.getAttribute('data-insight-tab');
                fill(section);
            });
        });
        // الرسم بيتظبط على عرض مكانه: بيترسم تاني لو العرض اتغير (تدوير الموبايل / تكبير الشاشة / الصفحة ظهرت بعد ما كانت مخفية)
        var box = section.querySelector('[data-insight-chart]');
        var seen = box ? box.clientWidth : 0;
        function again() {
            if (!box || box.clientWidth === seen) return;
            seen = box.clientWidth;
            draw(section);
        }
        if (window.ResizeObserver && box) new ResizeObserver(again).observe(box);
        else window.addEventListener('resize', again);
    }

    function refresh(root) {
        (root || document).querySelectorAll('[data-insights]').forEach(setup);
    }
    window.SharyProperty = { refresh: refresh };
    refresh(document);

    // ---------- شريط الملخص [data-prop-bar]: بيفضل ثابت تحت الهيدر وأنت نازل ----------
    // ديسك توب: الشريط كله ثابت. موبايل: سطر العنوان بيطلع مع الصفحة وسطر السعر هو اللي بيفضل ثابت تحت الهيدر.
    document.querySelectorAll('[data-prop-bar]').forEach(function (bar) {
        var prices = bar.querySelector('.prop-bar__prices');
        var scope = bar.closest('[lang]') || document;
        var wide = window.matchMedia('(min-width: 1024px)');
        var top = null;
        function place() {
            if (!bar.offsetHeight) return;   // الصفحة مخفية دلوقتي
            var header = scope.querySelector('header');
            var base = header ? (parseFloat(window.getComputedStyle(header).top) || 0) + header.offsetHeight : 0;
            var shift = wide.matches || !prices ? 0 : prices.getBoundingClientRect().top - bar.getBoundingClientRect().top - 10;
            top = Math.round(base - shift);
            bar.style.top = top + 'px';
            stuck();
        }
        function stuck() {
            if (top === null) return;
            bar.classList.toggle('is-stuck', bar.getBoundingClientRect().top <= top + 1 && window.pageYOffset > 0);
        }
        var waiting = false;
        window.addEventListener('scroll', function () {
            if (waiting) return;
            waiting = true;
            // مكان الشريط بيتحسب تاني مع السكرول: لو ارتفاع أو مكان الهيدر اتغير بعد التحميل (شريط فوقه، خط اتحمل) الشريط ما يتغطاش بالهيدر
            window.requestAnimationFrame(function () { waiting = false; place(); });
        }, { passive: true });
        window.addEventListener('resize', place);
        if (window.ResizeObserver) new ResizeObserver(place).observe(bar);
        place();
    });

    // ---------- المعرض على الموبايل [data-gallery-slider]: صورة في النص بالألوان بتتسحب بالجنب (وطرف اللي جنبها أبيض وأسود) وتحتها نقط ----------
    // الصورة اللي قدام العميل بتبقى هي المفتوحة (data-active="1")، فالضغط عليها بيفتح عارض الصور على طول
    var narrow = window.matchMedia('(max-width: 1023px)');
    document.querySelectorAll('[data-gallery-slider]').forEach(function (track) {
        var slides = Array.prototype.slice.call(track.querySelectorAll('[data-gallery-item]'));
        var holder = track.parentNode.querySelector('[data-gallery-dots]');
        if (slides.length < 2 || !holder) return;
        var dots = slides.map(function () { return holder.appendChild(document.createElement('i')); });
        // thumbs (وحدة البيع على الموبايل): صورة كبيرة وتحتها صور صغيرة — مفيش سحب، الصورة المفتوحة بتتبدّل مكانها زي الديسك توب
        var thumbs = track.classList.contains('rent-gallery--thumbs');
        function mark() {
            if (!narrow.matches || thumbs || !track.offsetWidth) return;
            var box = track.getBoundingClientRect();
            var middle = box.left + box.width / 2;
            var best = 0, gap = Infinity;
            // الصورة اللي في نص المعرض هي المفتوحة (بالألوان) — اللي جنبها أبيض وأسود
            slides.forEach(function (slide, i) {
                var r = slide.getBoundingClientRect();
                var d = Math.abs(r.left + r.width / 2 - middle);
                if (d < gap) { gap = d; best = i; }
            });
            slides.forEach(function (slide, i) { slide.setAttribute('data-active', i === best ? '1' : '0'); });
            dots.forEach(function (dot, i) { dot.setAttribute('aria-current', i === best ? 'true' : 'false'); });
        }
        var waiting = false;
        track.addEventListener('scroll', function () {
            if (waiting) return;
            waiting = true;
            window.requestAnimationFrame(function () { waiting = false; mark(); });
        }, { passive: true });
        dots[0].setAttribute('aria-current', 'true');
        mark();

        // الصور بتتقلّب لوحدها بالراحة، واحدة واحدة (كل 4.5 ثانية): موبايل بتتسحب للصورة اللي بعدها — ديسك توب الشريحة اللي بعدها هي اللي بتتفتح.
        // بتقف طول ما العميل ماسكها أو واقف عليها بالماوس، ولو عارض الصور مفتوح، ولو المعرض مش ظاهر على الشاشة، ولو الجهاز مطفّي الحركة.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        var wrap = track.parentNode;
        var held = false, seen = true, resume = null;
        function hold() { held = true; if (resume) { clearTimeout(resume); resume = null; } }
        function release(wait) { if (resume) clearTimeout(resume); resume = setTimeout(function () { held = false; resume = null; }, wait); }
        wrap.addEventListener('mouseenter', hold);
        wrap.addEventListener('mouseleave', function () { release(0); });
        wrap.addEventListener('touchstart', hold, { passive: true });
        wrap.addEventListener('touchend', function () { release(5000); }, { passive: true });
        wrap.addEventListener('focusin', hold);
        wrap.addEventListener('focusout', function () { release(0); });
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) { seen = entries[0].isIntersecting; }, { threshold: 0.5 }).observe(wrap);
        }
        window.setInterval(function () {
            if (held || !seen || document.hidden || !track.offsetWidth) return;
            if (document.querySelector('[data-rent-lightbox]:not(.hidden)')) return;
            var at = 0;
            slides.forEach(function (slide, i) { if (slide.getAttribute('data-active') === '1') at = i; });
            var next = (at + 1) % slides.length;
            if (narrow.matches && !thumbs) {
                var to = slides[next].getBoundingClientRect(), frame = track.getBoundingClientRect();
                var left = track.scrollLeft + (to.left + to.width / 2) - (frame.left + frame.width / 2);
                track.scrollTo({ left: left, behavior: 'smooth' });
            } else {
                slides.forEach(function (slide, i) { slide.setAttribute('data-active', i === next ? '1' : '0'); });
            }
        }, 4500);
    });

    // ---------- متابعة المشروع [data-follow-toggle]: "متابعة" ⇄ "متابَع". بتتحفظ على جهاز العميل (localStorage: shary:follows).
    // حدث shary:follow ({ id, following }) على الزرار: اسمعوه عشان تحفظوا المتابعة على حساب العميل، أو امنعوه (preventDefault) لو محتاجين تسجيل دخول الأول.
    document.querySelectorAll('[data-follow-toggle]').forEach(function (button) {
        var label = button.querySelector('[data-label]');
        function saved() { try { return JSON.parse(window.localStorage.getItem('shary:follows') || '[]'); } catch (e) { return []; } }
        function paint(on) {
            button.setAttribute('aria-pressed', on ? 'true' : 'false');
            if (label) label.textContent = button.getAttribute(on ? 'data-on' : 'data-off');
        }
        paint(saved().indexOf(button.getAttribute('data-follow-id')) > -1);
        button.addEventListener('click', function () {
            var id = button.getAttribute('data-follow-id');
            var on = button.getAttribute('aria-pressed') !== 'true';
            var event = new CustomEvent('shary:follow', { bubbles: true, cancelable: true, detail: { id: id, following: on } });
            if (!button.dispatchEvent(event)) return;
            var list = saved().filter(function (item) { return item !== id; });
            if (on) list.push(id);
            try { window.localStorage.setItem('shary:follows', JSON.stringify(list)); } catch (e) {}
            paint(on);
        });
    });

    // ---------- زرار "الخريطة" على الديسك توب [data-map-open]: بيفتح خريطة المشروع على الشاشة كلها (نفس زرار التكبير في js/shary/area-page.js) ----------
    document.querySelectorAll('[data-map-open]').forEach(function (button) {
        button.addEventListener('click', function () {
            var expand = document.querySelector('.prop-map [data-map-expand]');
            if (expand) expand.click();
        });
    });

    // ---------- خطط الدفع في المشروع [data-plan-list]: "عرض كل الخطط" بيفرد باقي الخطط على الموبايل ويقفلها ----------
    document.querySelectorAll('[data-plan-list]').forEach(function (list) {
        var toggle = list.querySelector('[data-plan-toggle]');
        if (!toggle) return;
        toggle.addEventListener('click', function () {
            var open = toggle.getAttribute('aria-expanded') !== 'true';
            list.querySelectorAll('[data-plan-extra]').forEach(function (item) { item.classList.toggle('hidden', !open); item.classList.toggle('flex', open); });
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.querySelector('[data-label]').textContent = toggle.getAttribute(open ? 'data-less' : 'data-more');
            toggle.querySelector('svg').style.transform = open ? 'rotate(180deg)' : '';
        });
    });

    // ---------- وحدات المشروع: التبويب + الترتيب + الصفحات ----------
    var desktop = window.matchMedia('(min-width: 1024px)');
    document.querySelectorAll('[data-project-units]').forEach(function (section) {
        var grid = section.querySelector('[data-project-grid]');
        if (!grid) return;
        var tabs = Array.prototype.slice.call(section.querySelectorAll('[data-unit-tab]'));
        var form = section.querySelector('form[data-area-filters]');   // فورم الفلاتر والترتيب (areas/partials/filters.blade.php)
        var count = section.querySelector('[data-units-count]');
        var empty = section.querySelector('[data-units-empty]');
        var sentinel = section.querySelector('[data-units-sentinel]');
        var perPage = parseInt(section.getAttribute('data-per-page'), 10) || 9;
        var STEP = 3;          // موبايل: 3 كروت في كل مرة
        function step() { return desktop.matches ? perPage : STEP; }   // ديسك توب: صفحة كاملة في المرة
        var shown = step();
        var busy = false;

        function current(list, name) {
            var on = list.filter(function (item) { return item.getAttribute('aria-current') === 'true'; })[0];
            return on ? on.getAttribute(name) : '';
        }
        function number(card, name) { return parseFloat(card.getAttribute(name)) || 0; }

        // اختيارات فورم الفلاتر: type[] ، bedrooms[] ، bathrooms[] ، finishing[] ، delivery[] ، years[] ، السعر والمساحة (من – إلى) ، sort
        function picked(name) {
            return form ? Array.prototype.map.call(form.querySelectorAll('input[name="' + name + '[]"]:checked'), function (box) { return box.value; }) : [];
        }
        function field(selector) {
            var input = form ? form.querySelector(selector) : null;
            return input && input.value !== '' ? Number(String(input.value).replace(/,/g, '')) : null;
        }
        function sortValue() {
            var radio = form ? form.querySelector('input[name="sort"]:checked') : null;
            return radio ? radio.value : '';
        }

        // الكروت اللي تبع التبويب المفتوح والفلاتر المختارة، مترتبة بالترتيب المختار
        function matching() {
            var tab = current(tabs, 'data-unit-tab');
            var sort = sortValue();
            var types = picked('type'), beds = picked('bedrooms'), baths = picked('bathrooms'), finishing = picked('finishing'), delivery = picked('delivery'), years = picked('years');
            var priceLow = field('[data-range-min="price"]'), priceHigh = field('[data-range-max="price"]');
            var sizeLow = field('[data-range-min="size"]'), sizeHigh = field('[data-range-max="size"]');
            function has(list, value) { return !list.length || list.indexOf(String(value)) > -1; }
            function deliveryYear(card) { return card.getAttribute('data-delivery') === 'ready' ? 0 : number(card, 'data-delivery'); }
            var by = {
                price_asc: function (a, b) { return number(a, 'data-price') - number(b, 'data-price'); },
                price_desc: function (a, b) { return number(b, 'data-price') - number(a, 'data-price'); },
                installment_asc: function (a, b) { return number(a, 'data-installment') - number(b, 'data-installment'); },
                installment_desc: function (a, b) { return number(b, 'data-installment') - number(a, 'data-installment'); },
                delivery: function (a, b) { return deliveryYear(a) - deliveryYear(b); }
            }[sort] || function () { return 0; };
            return Array.prototype.slice.call(grid.querySelectorAll(':scope > [data-unit]'))
                .filter(function (card) {
                    var price = number(card, 'data-price'), size = number(card, 'data-size'), y = number(card, 'data-years');
                    return (!tab || (tab === 'invest' ? card.getAttribute('data-invest') === '1' : card.getAttribute('data-sale') === tab)) &&
                        has(types, card.getAttribute('data-types')) && has(beds, card.getAttribute('data-beds')) && has(baths, card.getAttribute('data-baths')) &&
                        has(finishing, card.getAttribute('data-finishing')) && has(delivery, card.getAttribute('data-delivery')) &&
                        (!years.length || years.indexOf(y >= 9 ? '9+' : String(y)) > -1) &&
                        (priceLow === null || price >= priceLow) && (priceHigh === null || price <= priceHigh) &&
                        (sizeLow === null || size >= sizeLow) && (sizeHigh === null || size <= sizeHigh);
                })
                .sort(function (a, b) { return by(a, b) || number(a, 'data-order') - number(b, 'data-order'); });
        }

        function render() {
            var list = matching();
            var visible = list.slice(0, shown);
            Array.prototype.forEach.call(grid.querySelectorAll(':scope > [data-unit]'), function (card) {
                card.classList.remove('lg:block');
                card.classList.add('hidden');
            });
            list.forEach(function (card) { grid.appendChild(card); });
            visible.forEach(function (card) { card.classList.remove('hidden'); });
            if (count) count.textContent = list.length;
            if (empty) empty.classList.toggle('hidden', list.length > 0);
            if (sentinel) {
                var more = shown < list.length;
                sentinel.classList.toggle('hidden', !more);
                sentinel.setAttribute('data-state', more ? 'idle' : 'done');
            }
        }

        // الوحدات بتكمّل لوحدها وأنت نازل (موبايل وديسك توب)
        function more() {
            if (busy || shown >= matching().length) return;
            busy = true;
            if (sentinel) sentinel.setAttribute('data-state', 'loading');
            setTimeout(function () {
                shown += step();
                busy = false;
                render();
                if (sentinel && !sentinel.classList.contains('hidden') && sentinel.getBoundingClientRect().top < window.innerHeight + 200) more();
            }, 350);
        }
        if (sentinel) {
            if ('IntersectionObserver' in window) {
                new IntersectionObserver(function (entries) { if (entries[0].isIntersecting) more(); }, { rootMargin: '300px 0px' }).observe(sentinel);
            } else {
                window.addEventListener('scroll', function () { if (sentinel.getBoundingClientRect().top < window.innerHeight + 300) more(); });
            }
        }
        if (desktop.addEventListener) desktop.addEventListener('change', function () { shown = Math.max(shown, step()); render(); });

        // قبل أي تبديل: حدث shary:project-units ({ tab, sort, filters, url }) — امنعوه لو الكروت هتيجي من السيرفر
        function apply(url) {
            var filters = {};
            if (form && window.FormData) new FormData(form).forEach(function (value, key) { if (value !== '') (filters[key] = filters[key] || []).push(value); });
            var detail = { tab: current(tabs, 'data-unit-tab'), sort: sortValue(), filters: filters, url: url || '' };
            if (!section.dispatchEvent(new CustomEvent('shary:project-units', { bubbles: true, cancelable: true, detail: detail }))) return;
            shown = step();
            render();
        }

        tabs.forEach(function (link) {
            link.addEventListener('click', function (event) {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.button) return;
                event.preventDefault();
                tabs.forEach(function (item) { item.setAttribute('aria-current', item === link ? 'true' : 'false'); });
                apply(link.href);
                var href = link.getAttribute('href') || '';
                if (href && href.charAt(0) !== '#' && window.history && history.replaceState) {
                    try { history.replaceState(history.state, '', link.href); } catch (error) { /* file:// */ }
                }
            });
        });

        // فورم الفلاتر والترتيب: "عرض النتائج" / "مسح" / اختيار ترتيب بيطلعوا حدث shary:filter (js/shary/area-page.js) —
        // هنا الفلترة بتتم على كروت الصفحة من غير ما الفورم يتبعت ولا الصفحة تتحمل
        if (form) {
            form.addEventListener('shary:filter', function (event) {
                event.preventDefault();
                event.stopPropagation();
                apply(form.getAttribute('action') || '');
                var top = section.getBoundingClientRect().top;
                if (top < 0) window.scrollTo({ top: window.pageYOffset + top - 150, behavior: 'smooth' });
            });
        }

        // لو الكروت اتبدّلت من بره (مثلاً من السيرفر): section.__renderUnits() بيعيد العرض من أول صفحة
        section.__renderUnits = function () { shown = step(); render(); };
        render();
    });
})();

/**
 * صفحة Shary AI (partials/ai-panel.blade.php) — بنفس ستراكشر نسخة شاري AI المعتمدة.
 * - أي عنصر عليه data-ask-ai بيفتح الصفحة. القفل من سهم الرجوع أو الضغط براها أو Esc.
 * - أسئلة الاختيار [data-ai-onb]: بتترسم من data-ai-config ← flow (المنطقة ← الحي ← الاستخدام ← نوع الوحدة ← الميزانية ← الهدف) ،
 *   كل سؤال بيظهر بعد اللي قبله. السؤال اللي عليه multiple: true العميل يختار فيه أكتر من اختيار (سكن + استثمار ، شقة + دوبلكس ، أكتر من منطقة) ،
 *   و"ابدأ البحث" بيبعت رسالة جاهزة + الاختيارات. "أو اكتب سؤالك مباشرة" بيفتح الشات على طول.
 *   answers المبعوتة: { area: ['new-cairo', 'sheikh-zayed'], sub: ['madinaty'], use: 'residential', type: ['apartment', 'duplex'], budget: '5000000-10000000', purpose: ['living', 'investment'] }
 *   (السؤال المتعدد = array ، السؤال العادي = قيمة واحدة).
 * - الإرسال: الرسالة بتتضاف (صورة + اسم + رسالة) وبيطلع حدث shary:ai-send على الصفحة:
 *       panel.addEventListener('shary:ai-send', function (event) {
 *           event.preventDefault();
 *           event.detail.reply('نص الرد', { cards: [...], chips: [...], meeting: true });   // detail.text ، detail.answers
 *       });
 *   لو الحدث ما اتمنعش وفيه data-endpoint: بيتبعت POST JSON { message, answers, session } والرد المتوقع JSON { reply, cards, chips, meeting, book, session }.
 * - كروت الرد (cards):
 *       { type: 'unit',    title, location, developer, developer_short, image, price, currency, beds, baths, area, plan, badge, url }
 *       { type: 'project', name,  location, developer, developer_short, image, price (يبدأ من), currency, types: [...], plan, index (مؤشر شاري), badge, url }
 *   وتحت كل كارت: اتصال + واتساب + احجز ميتنج + التفاصيل (url). meeting: true = كارت "تحب تتكلم مع مستشار شاري؟".
 * - حجز الميتنج جوه الشات (من غير ما العميل يسيب المحادثة):
 *     بيبدأ من: زرار "احجز ميتنج" تحت أي كارت (الحجز بيتربط بالوحدة/المشروع ده) ، كارت "تحب تتكلم مع مستشار شاري؟" ،
 *     أو لو العميل كتب/ضغط "عايز أحجز ميتنج" (كلمات lang/ai.php ← book.words) ، أو لو السيرفر رجّع book: true.
 *     الخطوات: بخصوص إيه (لو فيه كروت معروضة ومش محدد) ← النوع (زوم / مكتب شاري / زيارة الموقع — الزيارة بس لو فيه وحدة أو مشروع)
 *              ← اليوم (7 أيام من النهارده) ← الساعة (كل المواعيد مفتوحة) ← الاسم والموبايل بكود الدولة (بيتراجعوا قبل الإرسال) ← تأكيد ← كارت التأكيد.
 *     الإرسال: حدث shary:ai-meeting (detail.data + detail.done(ok, message)) — لو ما اتمنعش: POST JSON على contact.meeting ($meetingUrl):
 *       { meeting_type: 'zoom' | 'in_person' | 'site_visit', meeting_date: 'Y-m-d', meeting_time: 'H:i', name, phone, country_code,
 *         subject, subject_type: 'unit' | 'project' | 'general', subject_url, source: 'shary-ai', answers, session }
 *     المواعيد الفاضية فعلًا (اختياري): contact.slots ($meetingSlotsUrl) ← GET ?date=Y-m-d&type=zoom والرد { slots: [{ value, label, available }] }.
 * - ديسك توب (1024px وأكبر): النافذة ثابتة على يمين الشاشة من غير تغميق — الصفحة وراها شغالة عادي والعميل يكمّل تصفح.
 *   بتفضل مفتوحة بنفس المحادثة وهو بيتنقل بين الصفحات (الحالة محفوظة في sessionStorage: shary-ai-state) لحد ما يقفلها بنفسه.
 *   موبايل: بملء الشاشة زي ما هي (والضغط على لينك كارت بيقفلها).
 * - "من الأول": محادثة جديدة ورجوع لأسئلة الاختيار. المايك بيظهر بس لو المتصفح بيدعم الإملاء الصوتي.
 *
 * ===== الإيجنت (تحديث) — كل ده جاهز في الفرونت ومستني الباك إند بس =====
 * - الرد بيبدأ من فوق: بعد أي رد الشات بيقف على أول الرد (النص وأول كارت) والعميل ينزل براحته — مش على آخر كارت.
 * - الطلب (POST JSON على data-endpoint ، ونفسه في event.detail):
 *       { message, answers, context, session, lang: 'ar' | 'en', via: 'steps' | 'text', page: '/projects/scenes' }
 *     answers = اختيارات العميل الحالية دايمًا (حتى مع الأسئلة المكتوبة) ، context = الصفحة اللي هو فاتحها ($aiContext): { type: 'project' | 'unit' | 'area' | 'developer', id, name, url }.
 * - الرد JSON (كل المفاتيح اختيارية):
 *       reply      نص الرد (**بولد** وسطور)
 *       id         رقم الرسالة (بيرجع مع التقييم)
 *       criteria   ['شقة', 'القاهرة الجديدة', 'حتى 10 مليون'] — اللي الإيجنت فهمه من كلام العميل: بيظهر في شريط "طلبك" فوق الشات
 *       options    ['2 غرف', '3 غرف', '4+'] — سؤال توضيحي: زراير تحت الرد ، الضغط بيبعت النص كرسالة
 *       stats      [{ label, value, unit, note, trend: 'up' | 'down' }] أو { title, items: [...] } — أرقام السوق (سعر المتر / العائد / مؤشر شاري)
 *       results    { total, search_url, title, visible } — عدد النتايج + لينك "اعرض الكل في البحث" (visible = عدد الكروت الظاهرة قبل "اعرض كمان" ، الافتراضي 3)
 *       cards      [{ ...الكارت زي فوق + slug (للمفضلة والمقارنة) , match: 92 (نسبة المطابقة) , reasons: ['في حدود ميزانيتك', ...] (ليه رشحناها) }]
 *       compare    { title, columns: ['سينز', 'آي سيتي'], rows: [{ label, values: [...], best: 0 }], note } — جدول مقارنة
 *       sources    [{ label, url }] — مصدر الأرقام
 *       actions    [{ label, url } | { label, say: 'نص يتبعت' } | { label, type: 'meeting' }] — زراير تحت الرد
 *       meeting    true = كارت "تحب تتكلم مع مستشار شاري؟" ، book = ابدأ حجز الميتنج ، lead: true | { title, text } = فورم "خلّي مستشار يكلمك" (اسم + موبايل)
 *       chips      اختصارات المتابعة فوق خانة الكتابة ، session رقم الجلسة ، feedback: false = من غير زراير التقييم ، error: true = رسالة خطأ + "حاول تاني"
 * - الرد على مراحل (اختياري — Streaming): لو الرد Content-Type: application/x-ndjson أو text/event-stream ، كل سطر JSON:
 *       { "status": "بدوّر في وحدات القاهرة الجديدة…" }   ← بيتكتب جنب نقط الكتابة
 *       { "delta": "جزء من النص" }                        ← النص بيتكتب قدام العميل
 *       { "reply": "...", "cards": [...], ... }           ← السطر الأخير: الرد الكامل بنفس المفاتيح اللي فوق
 *   ومن غير endpoint (حدث shary:ai-send): event.detail.status('...') ، event.detail.stream('...') ، event.detail.reply(text, more) ، event.detail.fail() ، event.detail.signal (AbortSignal — العميل ضغط "إيقاف").
 * - التقييم 👍 / 👎 / نسخ تحت كل رد: حدث shary:ai-feedback ({ id, value: 'up' | 'down', reason, text, session }) + POST JSON على contact.feedback ($aiFeedbackUrl) لو موجود.
 * - "خلّي مستشار يكلمك" (lead): حدث shary:ai-lead ({ data, done(ok, message) }) + POST JSON على contact.lead ($aiLeadUrl):
 *       { name, phone, country_code, message (آخر سؤال للعميل), source: 'shary-ai', answers, context, session }
 * - شريط "طلبك" [data-ai-criteria]: اختيارات العميل (أو criteria من الرد) + "تعديل" بيرجّعه للأسئلة باختياراته ويبعت البحث من جديد.
 * - المفضلة والمقارنة على الكارت بنفس زراير الموقع (data-favorite-toggle / data-compare-toggle) — بتشتغل مع site-chrome.js من غير أي كود زيادة.
 * - أي زرار data-ask-ai يقدر يفتح الإيجنت على حاجة معينة: data-ai-context='{"type":"project","id":"scenes","name":"سينز","url":"..."}' (سياق الزرار ده)
 *   و data-ai-ask="أسعار وخطط السداد في سينز" (السؤال بيتبعت على طول). من الكود: panel.sharyContext({...}) ، panel.sharyAsk('...') ، panel.sharyOpen() ، panel.sharyClose().
 * - وقت الانتظار: حالات بتتغير ("بفهم طلبك…" ← "بدوّر في بيانات شاري…" ← "برتّب أنسب النتايج…") من lang/ai.php ← ui.steps ، وزرار الإرسال بيبقى "إيقاف".
 */
(function () {
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-ai-panel]'));
    if (!panels.length) return;

    function make(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
    }
    var ICONS = {
        bed: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 15h18M6 10V7.500A1.500 1.500 0 0 1 7.500 6h9A1.500 1.500 0 0 1 18 7.500V10"/></svg>',
        bath: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2ZM6 12V6.500A2.500 2.500 0 0 1 8.500 4c1.200 0 2 .700 2.300 1.700M7 19l-1 2M17 19l1 2"/></svg>',
        size: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20 20 4M4 20V9M4 20h11M9 15l2 2M13 11l2 2"/></svg>',
        phone: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.600 10.800a15.100 15.100 0 0 0 6.600 6.600l2.200-2.200a1 1 0 0 1 1-.250 11.400 11.400 0 0 0 3.600.570 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.500a1 1 0 0 1 1 1c0 1.250.200 2.450.570 3.570a1 1 0 0 1-.250 1L6.600 10.800Z"/></svg>',
        calendar: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.500" y="5" width="17" height="15" rx="2.500"/><path d="M8 3v4M16 3v4M3.500 10h17"/></svg>',
        check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.500 4.500 4.500L19 7.500"/></svg>',
        pin: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.200 7 13 7 13s7-7.800 7-13a7 7 0 0 0-7-7Zm0 9.500A2.500 2.500 0 1 1 12 6.500a2.500 2.500 0 0 1 0 5Z"/></svg>',
        heart: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.500s-7.500-4.600-7.500-10.200A4.300 4.300 0 0 1 12 7.600a4.300 4.300 0 0 1 7.500 2.700c0 5.600-7.500 10.200-7.500 10.200Z"/></svg>',
        compare: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4v16M16 4v16M4 8l4-4 4 4M12 16l4 4 4-4"/></svg>',
        up: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 11v9H4v-9h3ZM7 11l4-7a2 2 0 0 1 2 2v4h5.500a1.500 1.500 0 0 1 1.500 1.800l-1.300 6A1.500 1.500 0 0 1 17.200 19H7"/></svg>',
        down: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 13V4h3v9h-3ZM17 13l-4 7a2 2 0 0 1-2-2v-4H5.500A1.500 1.500 0 0 1 4 12.200l1.300-6A1.500 1.500 0 0 1 6.800 5H17"/></svg>',
        copy: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8.500" y="8.500" width="11" height="11" rx="2.500"/><path d="M15.500 5.500v-1a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h1"/></svg>',
        tick: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.500 4.500 4.500L19 7.500"/></svg>',
        search: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="6.500"/><path d="m20 20-4.200-4.200"/></svg>'
    };

    panels.forEach(function (panel) {
        var config = {};
        try { config = JSON.parse(panel.getAttribute('data-ai-config') || '{}'); } catch (error) { config = {}; }
        var T = config.text || {};
        var flow = Array.isArray(config.flow) ? config.flow : [];
        var contact = config.contact || {};
        var user = config.user || {};

        var onb = panel.querySelector('[data-ai-onb]');
        var stepsBox = panel.querySelector('[data-ai-steps]');
        var startButton = panel.querySelector('[data-ai-start]');
        var skipButton = panel.querySelector('[data-ai-skip]');
        var scroll = panel.querySelector('[data-ai-scroll]');
        var list = panel.querySelector('[data-ai-messages]');
        var chipsBox = panel.querySelector('[data-ai-chips]');
        var form = panel.querySelector('[data-ai-form]');
        var input = form.querySelector('[name="message"]');
        var opener = null;
        var answers = {};          // اختيارات الأسئلة: { area: [{ value, label }, ...], ... } — دايمًا قايمة (السؤال العادي فيها عنصر واحد)
        var session = '';          // رقم الجلسة اللي بيرجعه السيرفر (اختياري)
        var busy = false;
        var stepsShown = 0;        // عدد الأسئلة الظاهرة (الحركة للسؤال الجديد بس)
        var B = T.book || {};      // نصوص حجز الميتنج
        var times = Array.isArray(contact.times) ? contact.times : [];
        var countries = Array.isArray(contact.countries) ? contact.countries : [];
        var wide = window.matchMedia('(min-width: 1024px)');   // ديسك توب: نافذة ثابتة على الجنب
        var STORE = 'shary-ai-state';
        var book = null;           // حجز الميتنج الشغال: { box, intro, state }
        var saved = { name: user.name || '', phone: user.phone || '', code: countries.length ? countries[0].code : '+20' };
        var langNode = panel.closest ? panel.closest('[lang]') : null;
        var english = ((langNode && langNode.lang) || document.documentElement.lang || 'ar').indexOf('en') === 0;
        var U = T.ui || {};        // نصوص الإيجنت (lang/ai.php ← ui)
        var context = config.context && config.context.name ? config.context : null;   // الصفحة اللي العميل فاتحها ($aiContext)
        var critBox = panel.querySelector('[data-ai-criteria]');
        var critList = critBox ? critBox.querySelector('[data-ai-criteria-list]') : null;
        var contextBox = panel.querySelector('[data-ai-context]');
        var sendButton = form.querySelector('.sai__send');
        var understood = [];       // اللي الإيجنت فهمه من كلام العميل (criteria في الرد) — بيظهر في شريط "طلبك"
        var lastText = '';         // آخر سؤال للعميل (بيتبعت مع "خلّي مستشار يكلمك")
        var stopNow = null;        // إيقاف الرد الشغال
        var sendLabel = sendButton ? (sendButton.getAttribute('aria-label') || '') : '';
        var startText = startButton ? startButton.textContent : '';
        var skipText = skipButton ? skipButton.textContent : '';

        // ---------- أسئلة الاختيار ----------
        function chosenOf(key) { return answers[key] || []; }
        function optionsOf(step) {
            var out = [];
            if (!step.depends) out = Array.isArray(step.options) ? step.options.slice() : [];
            else {
                // اختيارات معتمدة على سؤال قبله: لو العميل اختار أكتر من قيمة هناك، الاختيارات بتتجمع من غير تكرار
                var map = step.options || {};
                var seen = {};
                chosenOf(step.depends).forEach(function (parent) {
                    (Array.isArray(map[parent.value]) ? map[parent.value] : []).forEach(function (option) {
                        if (seen[option.value]) return;
                        seen[option.value] = true;
                        out.push(option);
                    });
                });
            }
            if (step.all && out.length) out.push({ value: '', label: step.all, exclusive: true });
            return out;
        }
        // الخطوات اللي ليها اختيارات دلوقتي (الحي بيظهر بس لو المنطقة ليها أحياء)
        function activeSteps() {
            return flow.filter(function (step) { return !step.depends || optionsOf(step).length; });
        }
        function isOn(key, value) { return chosenOf(key).some(function (item) { return item.value === value; }); }
        function renderSteps(quiet) {
            if (!stepsBox) return;
            stepsBox.textContent = '';
            var steps = activeSteps();
            var open = true;
            var count = 0;
            steps.forEach(function (step) {
                if (!open) return;
                count += 1;
                var block = make('div', 'sai__step' + (count > stepsShown ? ' sai__step--new' : ''));
                var head = make('p', 'sai__q');
                head.appendChild(make('b', '', step.question));
                var hint = step.hint || (step.multiple ? T.multi : '');
                if (hint) head.appendChild(make('span', '', hint));
                block.appendChild(head);
                var opts = make('div', 'sai__opts' + (step.multiple ? ' sai__opts--multi' : ''));
                optionsOf(step).forEach(function (option) {
                    var button = make('button', '', option.label);
                    button.type = 'button';
                    var on = isOn(step.key, option.value);
                    if (on) button.className = 'is-on';
                    button.setAttribute('aria-pressed', on ? 'true' : 'false');
                    button.addEventListener('click', function () { pick(step, option); });
                    opts.appendChild(button);
                });
                block.appendChild(opts);
                stepsBox.appendChild(block);
                if (!chosenOf(step.key).length) open = false;   // السؤال اللي بعده بيظهر بعد أول اختيار
            });
            var grew = count > stepsShown;
            stepsShown = count;
            var done = steps.length > 0 && steps.every(function (step) { return chosenOf(step.key).length > 0; });
            if (startButton) startButton.disabled = !done;
            var target = done ? startButton : (grew ? stepsBox.lastElementChild : null);
            if (!quiet && target && target.scrollIntoView) target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
        function pick(step, option) {
            var item = { value: option.value, label: option.label, exclusive: !!option.exclusive };
            var current = chosenOf(step.key).slice();
            if (!step.multiple) current = [item];
            else if (isOn(step.key, option.value)) current = current.filter(function (one) { return one.value !== option.value; });   // ضغطة تانية بتشيل الاختيار
            else if (item.exclusive) current = [item];                                                                              // "أي منطقة" / "كل الأحياء" بتلغي الباقي
            else { current = current.filter(function (one) { return !one.exclusive; }); current.push(item); }
            if (current.length) answers[step.key] = current; else delete answers[step.key];
            // الأسئلة المعتمدة على السؤال ده: بنشيل منها الاختيارات اللي ما بقتش متاحة
            flow.forEach(function (next) {
                if (!next.depends || !answers[next.key]) return;
                var allowed = optionsOf(next).map(function (one) { return one.value; });
                var kept = answers[next.key].filter(function (one) { return allowed.indexOf(one.value) > -1; });
                if (kept.length) answers[next.key] = kept; else delete answers[next.key];
            });
            renderSteps();
        }
        // أسماء الاختيارات — ولو العميل اختار "الكل" بس بيتكتب "الكل"
        function labels(key, joiner) {
            var picked = chosenOf(key);
            var named = picked.filter(function (item) { return item.value !== ''; });
            return (named.length ? named : picked).map(function (item) { return item.label; }).join(joiner);
        }
        function queryText() {
            var or = T.or || ' / ';
            var text = String(T.query || '');
            // المكان: أحياء كل منطقة لو العميل اختار منها — وإلا اسم المنطقة نفسها
            var subStep = flow.filter(function (step) { return step.key === 'sub'; })[0];
            var subMap = (subStep && subStep.options) || {};
            var places = [];
            chosenOf('area').forEach(function (area) {
                var mine = chosenOf('sub').filter(function (sub) { return sub.value !== '' && (Array.isArray(subMap[area.value]) ? subMap[area.value] : []).some(function (option) { return option.value === sub.value; }); });
                if (mine.length) mine.forEach(function (sub) { places.push(sub.label); }); else places.push(area.label);
            });
            var map = { type: labels('type', or), use: labels('use', or), place: places.join(or), budget: labels('budget', or), purpose: labels('purpose', T.and || ' + ') };
            Object.keys(map).forEach(function (key) { text = text.replace(':' + key, map[key]); });
            return text.replace(/\s+/g, ' ').trim();
        }
        // السؤال المتعدد = array من القيم ، السؤال العادي = قيمة واحدة
        function plainAnswers() {
            var out = {};
            flow.forEach(function (step) {
                if (!chosenOf(step.key).length) return;
                var values = chosenOf(step.key).map(function (item) { return item.value; }).filter(function (value) { return value !== ''; });
                // "الكل": بتتبعت كل قيم السؤال
                if (!values.length && step.multiple) values = optionsOf(step).map(function (option) { return option.value; }).filter(function (value) { return value !== ''; });
                out[step.key] = step.multiple ? values : (values[0] || '');
            });
            return out;
        }

        // ---------- شريط "طلبك": اختيارات العميل (أو اللي الإيجنت فهمه من كلامه) + "تعديل" ----------
        function criteriaLabels() {
            if (understood.length) return understood.slice();
            var out = [];
            flow.forEach(function (step) { var text = labels(step.key, U.sep || '، '); if (text) out.push(text); });
            return out;
        }
        function renderCriteria() {
            if (!critBox || !critList) return;
            critList.textContent = '';
            criteriaLabels().forEach(function (text) { critList.appendChild(make('span', '', text)); });
            critBox.classList.toggle('hidden', !critList.children.length || scroll.classList.contains('hidden'));
        }
        function onbLabels() {
            var started = list.children.length > 1;
            if (startButton) startButton.textContent = started && U.update ? U.update : startText;
            if (skipButton) skipButton.textContent = started && U.back_chat ? U.back_chat : skipText;
        }
        // "تعديل": رجوع للأسئلة بنفس الاختيارات — المحادثة بتفضل زي ما هي
        function editCriteria() {
            if (busy || !onb) return;
            dropBook();
            understood = [];
            scroll.classList.add('hidden');
            if (chipsBox) chipsBox.classList.add('hidden');
            if (critBox) critBox.classList.add('hidden');
            onb.classList.remove('hidden');
            stepsShown = flow.length;
            renderSteps(true);
            onbLabels();
            onb.scrollTop = 0;
        }
        // الصفحة اللي العميل فاتحها: سطر "بتتفرج على …" + أسئلة جاهزة عنها
        function renderContext() {
            if (!contextBox) return;
            contextBox.textContent = '';
            contextBox.classList.toggle('hidden', !context);
            if (!context) return;
            var head = make('p', 'sai__ctx-head');
            head.appendChild(make('span', '', U.context || ''));
            head.appendChild(make('b', '', context.name));
            contextBox.appendChild(head);
            var asks = make('div', 'sai__asks');
            ((U.context_chips || {})[context.type] || []).forEach(function (text) {
                var button = make('button', '', String(text).replace(':name', context.name));
                button.type = 'button';
                button.setAttribute('data-ai-say', button.textContent);
                asks.appendChild(button);
            });
            if (asks.children.length) contextBox.appendChild(asks);
        }

        // ---------- الشات ----------
        function showChat() {
            if (onb) onb.classList.add('hidden');
            scroll.classList.remove('hidden');
            if (chipsBox && chipsBox.children.length) chipsBox.classList.remove('hidden');
            if (!list.children.length && T.welcome) bubble(T.welcome, false);
            renderCriteria();
        }
        function toBottom() { scroll.scrollTop = scroll.scrollHeight; }
        // الرد بيبدأ من فوق: الشات بيقف على أول الرد (مش آخره) والعميل ينزل براحته
        function toNode(node) {
            if (!node || !node.getBoundingClientRect) { toBottom(); return; }
            var top = Math.max(0, node.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop - 10);
            scroll.scrollTop = top;
        }
        function avatar(mine) {
            var node = make('span', 'sai__avatar ' + (mine ? 'sai__avatar--me' : 'sai__avatar--bot'));
            node.setAttribute('aria-hidden', 'true');
            if (mine && user.avatar) { node.style.backgroundImage = 'url("' + String(user.avatar).replace(/"/g, '%22') + '")'; node.classList.add('sai__avatar--img'); }
            else node.textContent = mine ? String(user.name || T.me || '').trim().slice(0, 1) : 'AI';
            return node;
        }
        function row(mine) {
            var line = make('div', 'sai__row ' + (mine ? 'sai__row--me' : 'sai__row--bot'));
            var col = make('div', 'sai__col');
            col.appendChild(make('span', 'sai__who', mine ? (user.name || T.me || '') : (T.bot || 'Shary AI')));
            line.appendChild(avatar(mine));
            line.appendChild(col);
            list.appendChild(line);
            return col;
        }
        // النص: **كلمة** = بولد ، وكل سطر في فقرة (من غير HTML من السيرفر)
        function fill(node, text) {
            String(text).split(/\n+/).forEach(function (lineText) {
                var p = make('p');
                lineText.split(/(\*\*[^*]+\*\*)/).forEach(function (part) {
                    if (/^\*\*[^*]+\*\*$/.test(part)) p.appendChild(make('b', '', part.slice(2, -2)));
                    else if (part) p.appendChild(document.createTextNode(part));
                });
                node.appendChild(p);
            });
        }
        function bubble(text, mine, stay) {
            var col = row(mine);
            var node = make('div', 'sai__msg ' + (mine ? 'sai__msg--me' : 'sai__msg--bot'));
            fill(node, text);
            col.appendChild(node);
            if (!stay) toBottom();
            return node;
        }
        function waLink(text) {
            var number = String(contact.whatsapp || '').replace(/\D+/g, '');
            return 'https://wa.me/' + number + (text ? '?text=' + encodeURIComponent(text) : '');
        }
        function action(className, label, icon, href) {
            var node = make(href ? 'a' : 'button', 'sai__way ' + className);
            if (href) { node.href = href; if (/^https?:/.test(href)) { node.target = '_blank'; node.rel = 'noopener'; } } else node.type = 'button';
            if (icon) node.insertAdjacentHTML('beforeend', icon);
            node.appendChild(make('span', '', label));
            return node;
        }
        // "احجز ميتنج": الحجز بيتم جوه الشات (item = الوحدة/المشروع اللي الزرار تحته — من غيره بنسأل "بخصوص إيه؟")
        function meetButton(label, className, item) {
            var node = action(className || 'sai__way--meet', label || T.meet, ICONS.calendar, '');
            var subject = subjectOf(item);
            node.setAttribute('data-ai-meet', subject ? JSON.stringify(subject) : '');
            return node;
        }
        function card(item) {
            var isUnit = item.type !== 'project';
            var name = isUnit ? item.title : item.name;
            var box = make('article', 'sai__card');
            box.setAttribute('data-subject', JSON.stringify(subjectOf(item) || {}));
            // المفضلة + المقارنة: نفس زراير الموقع (site-chrome.js) — محتاجة slug الوحدة / المشروع
            if (item.slug && item.image) {
                var tools = make('div', 'sai__card-tools');
                var fav = make('button', 'sai__tool sai__tool--fav'); fav.type = 'button';
                fav.setAttribute('data-favorite-toggle', '');
                fav.setAttribute('data-favorite-id', item.favorite_id || ((isUnit ? 'units/' : 'projects/') + item.slug));
                fav.setAttribute('aria-pressed', 'false'); fav.setAttribute('aria-label', U.fav || ''); fav.title = U.fav || '';
                fav.innerHTML = ICONS.heart;
                var cmp = make('button', 'sai__tool sai__tool--cmp'); cmp.type = 'button';
                cmp.setAttribute('data-compare-toggle', '');
                cmp.setAttribute('data-compare-type', isUnit ? 'unit' : 'project');
                cmp.setAttribute('data-compare-id', item.slug);
                cmp.setAttribute('aria-pressed', 'false'); cmp.setAttribute('aria-label', U.compare || ''); cmp.title = U.compare || '';
                cmp.innerHTML = ICONS.compare;
                tools.appendChild(cmp); tools.appendChild(fav);
                box.appendChild(tools);
            }
            if (item.image) {
                var photo = make(item.url ? 'a' : 'span', 'sai__card-photo');
                if (item.url) photo.href = item.url;
                var img = make('img');
                img.src = item.image; img.alt = name || ''; img.loading = 'lazy';
                if (item.image_fallback) img.onerror = function () { img.onerror = null; img.src = item.image_fallback; };
                photo.appendChild(img);
                if (item.badge) photo.appendChild(make('span', 'sai__card-badge', item.badge));
                box.appendChild(photo);
            }
            var body = make('div', 'sai__card-body');
            // شريط المطور: الحروف المختصرة + الاسم (+ مؤشر شاري للمشروع)
            var dev = make('div', 'sai__card-dev');
            dev.appendChild(make('span', 'sai__card-logo', item.developer_short || String(item.developer || '').slice(0, 2)));
            dev.appendChild(make('span', 'sai__card-devname', item.developer || ''));
            if (!isUnit && item.index) {
                var score = make('span', 'sai__card-index');
                score.appendChild(make('b', '', String(item.index)));
                score.appendChild(make('small', '', T.index || ''));
                dev.appendChild(score);
            }
            body.appendChild(dev);
            var title = make('h3', 'sai__card-title');
            if (item.url) { var link = make('a', '', name || ''); link.href = item.url; title.appendChild(link); } else title.textContent = name || '';
            body.appendChild(title);
            if (item.location) {
                var place = make('p', 'sai__card-place');
                place.insertAdjacentHTML('beforeend', ICONS.pin);
                place.appendChild(make('span', '', item.location));
                body.appendChild(place);
            }
            // السعر: رقم كبير ذهبي
            if (item.price) {
                var price = make('p', 'sai__card-price');
                if (!isUnit) price.appendChild(make('small', '', T.from || ''));
                var amount = make('b', '', String(item.price)); amount.dir = 'ltr';
                price.appendChild(amount);
                price.appendChild(make('span', '', item.currency || T.currency || ''));
                body.appendChild(price);
            }
            if (item.plan) body.appendChild(make('p', 'sai__card-plan', item.plan));
            // نسبة المطابقة لطلب العميل (match: 0 – 100)
            var match = Math.max(0, Math.min(100, parseInt(item.match, 10) || 0));
            if (match) {
                var fit = make('div', 'sai__card-fit');
                var fitText = make('p');
                fitText.appendChild(make('b', '', match + '%'));
                fitText.appendChild(make('span', '', U.match || ''));
                var bar = make('i'); var barFill = make('i'); barFill.style.width = match + '%'; bar.appendChild(barFill);
                fit.appendChild(fitText); fit.appendChild(bar);
                body.appendChild(fit);
            }
            // خانات الوحدة (غرف / حمامات / مساحة) أو أنواع وحدات المشروع
            if (isUnit) {
                var cells = make('ul', 'sai__card-cells');
                [[item.beds, T.beds, ICONS.bed], [item.baths, T.baths, ICONS.bath], [item.area, T.area, ICONS.size]].forEach(function (cell) {
                    if (cell[0] == null || cell[0] === '') return;
                    var li = make('li');
                    li.insertAdjacentHTML('beforeend', cell[2]);
                    li.appendChild(make('b', '', String(cell[0])));
                    li.appendChild(make('span', '', cell[1] || ''));
                    cells.appendChild(li);
                });
                if (cells.children.length) body.appendChild(cells);
            } else if (Array.isArray(item.types) && item.types.length) {
                var types = make('p', 'sai__card-types');
                item.types.slice(0, 4).forEach(function (type) { types.appendChild(make('span', '', type)); });
                body.appendChild(types);
            }
            // ليه رشحناها (reasons)
            if (Array.isArray(item.reasons) && item.reasons.length) {
                var why = make('div', 'sai__card-why');
                why.appendChild(make('b', '', U.why || ''));
                var whyList = make('ul');
                item.reasons.slice(0, 4).forEach(function (reason) {
                    var li = make('li');
                    li.insertAdjacentHTML('beforeend', ICONS.tick);
                    li.appendChild(make('span', '', String(reason)));
                    whyList.appendChild(li);
                });
                why.appendChild(whyList);
                body.appendChild(why);
            }
            // التواصل: اتصال + واتساب + احجز ميتنج (+ التفاصيل)
            var ways = make('div', 'sai__ways');
            ways.appendChild(action('sai__way--call', T.call, ICONS.phone, 'tel:' + (contact.phone || '')));
            var wa = action('sai__way--wa', T.whatsapp, '', waLink(name ? name + (item.url ? '\n' + item.url : '') : ''));
            wa.insertAdjacentHTML('afterbegin', '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>');
            ways.appendChild(wa);
            ways.appendChild(meetButton(null, null, item));
            body.appendChild(ways);
            if (item.url) { var more = make('a', 'sai__card-more', T.details || ''); more.href = item.url; body.appendChild(more); }
            box.appendChild(body);
            return box;
        }
        // كروت النتايج: عنوان بالعدد + "اعرض الكل في البحث" ← أول 3 كروت ← "اعرض كمان" ← لينك كل النتايج
        function cards(items, info) {
            if (!Array.isArray(items) || !items.length) return;
            info = info && typeof info === 'object' ? info : {};
            items = items.filter(function (item) { return item && typeof item === 'object'; });
            var total = parseInt(info.total, 10) || items.length;
            var wrap = make('div', 'sai__cards');
            var head = make('div', 'sai__res');
            head.appendChild(make('b', '', info.title || String(U.results || '').replace(':count', total)));
            if (info.search_url) {
                var all = make('a', '', U.see_all || ''); all.href = info.search_url;
                all.insertAdjacentHTML('afterbegin', ICONS.search);
                head.appendChild(all);
            }
            wrap.appendChild(head);
            var show = parseInt(info.visible, 10) || 3;
            items.forEach(function (item, index) {
                var box = card(item);
                if (index >= show) box.hidden = true;
                wrap.appendChild(box);
            });
            if (items.length > show) {
                var more = make('button', 'sai__more', String(U.more_cards || '').replace(':count', items.length - show)); more.type = 'button';
                more.setAttribute('data-ai-more', '');
                wrap.appendChild(more);
            }
            if (info.search_url && total > items.length) {
                var link = make('a', 'sai__more sai__more--all', String(U.all_results || '').replace(':count', total)); link.href = info.search_url;
                wrap.appendChild(link);
            }
            list.appendChild(wrap);
            if (window.SharyCards) window.SharyCards.refresh(wrap);
        }
        // أرقام السوق: [{ label, value, unit, note, trend }] أو { title, items }
        function statsBlock(data) {
            var items = Array.isArray(data) ? data : (data && Array.isArray(data.items) ? data.items : []);
            if (!items.length) return;
            var box = make('div', 'sai__blk sai__stats');
            if (data.title) box.appendChild(make('b', 'sai__blk-title', data.title));
            var grid = make('div', 'sai__stats-grid');
            items.slice(0, 6).forEach(function (item) {
                var cell = make('div', 'sai__stat');
                cell.appendChild(make('span', '', item.label || ''));
                var value = make('p');
                value.appendChild(make('b', '', String(item.value == null ? '' : item.value)));
                if (item.unit) value.appendChild(make('small', '', item.unit));
                cell.appendChild(value);
                if (item.note) cell.appendChild(make('em', item.trend === 'up' ? 'is-up' : (item.trend === 'down' ? 'is-down' : ''), (item.trend === 'up' ? '▲ ' : (item.trend === 'down' ? '▼ ' : '')) + item.note));
                grid.appendChild(cell);
            });
            box.appendChild(grid);
            list.appendChild(box);
        }
        // جدول المقارنة: { title, columns: [...], rows: [{ label, values: [...], best }], note }
        function compareBlock(data) {
            if (!data || !Array.isArray(data.columns) || !Array.isArray(data.rows) || !data.columns.length) return;
            var box = make('div', 'sai__blk sai__cmp');
            if (data.title) box.appendChild(make('b', 'sai__blk-title', data.title));
            var scroller = make('div', 'sai__cmp-scroll');
            var table = make('table');
            var top = make('tr');
            top.appendChild(make('th', '', ''));
            data.columns.forEach(function (column) { top.appendChild(make('th', '', typeof column === 'object' && column ? (column.name || '') : String(column))); });
            var thead = make('thead'); thead.appendChild(top); table.appendChild(thead);
            var tbody = make('tbody');
            data.rows.forEach(function (line) {
                if (!line) return;
                var tr = make('tr');
                tr.appendChild(make('th', '', line.label || ''));
                (Array.isArray(line.values) ? line.values : []).forEach(function (value, index) {
                    var td = make('td', line.best === index ? 'is-best' : '', String(value == null ? '—' : value));
                    if (line.best === index && U.best) td.title = U.best;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            scroller.appendChild(table);
            box.appendChild(scroller);
            if (data.note) box.appendChild(make('p', 'sai__blk-note', data.note));
            list.appendChild(box);
        }
        function sourcesBlock(items) {
            if (!Array.isArray(items) || !items.length) return;
            var box = make('p', 'sai__src');
            box.appendChild(make('span', '', U.sources || ''));
            items.slice(0, 4).forEach(function (item) {
                if (!item) return;
                var node = make(item.url ? 'a' : 'b', '', item.label || item.url || '');
                if (item.url) node.href = item.url;
                box.appendChild(node);
            });
            list.appendChild(box);
        }
        // سؤال توضيحي (options) / زراير تحت الرد (actions)
        function optionsBlock(items) {
            if (!Array.isArray(items) || !items.length) return;
            var box = make('div', 'sai__asks sai__asks--chat');
            items.slice(0, 8).forEach(function (item) {
                var label = typeof item === 'object' && item ? (item.label || '') : String(item);
                if (!label) return;
                var button = make('button', '', label); button.type = 'button';
                button.setAttribute('data-ai-say', (typeof item === 'object' && item && item.say) || label);
                box.appendChild(button);
            });
            list.appendChild(box);
        }
        function actionsBlock(items) {
            if (!Array.isArray(items) || !items.length) return;
            var box = make('div', 'sai__acts');
            items.slice(0, 4).forEach(function (item) {
                if (!item || !item.label) return;
                if (item.type === 'meeting') { box.appendChild(meetButton(item.label, 'sai__act', null)); return; }
                var node = make(item.url ? 'a' : 'button', 'sai__act', item.label);
                if (item.url) node.href = item.url; else { node.type = 'button'; node.setAttribute('data-ai-say', item.say || item.label); }
                box.appendChild(node);
            });
            if (box.children.length) list.appendChild(box);
        }
        // التقييم تحت الرد: 👍 / 👎 / نسخ
        function feedbackBar(id) {
            var bar = make('div', 'sai__fb');
            bar.setAttribute('data-ai-fb', id == null ? '' : String(id));
            [['up', U.fb_up, ICONS.up], ['down', U.fb_down, ICONS.down], ['copy', U.copy, ICONS.copy]].forEach(function (one) {
                var button = make('button', 'sai__fb-btn'); button.type = 'button';
                button.setAttribute('data-fb', one[0]);
                button.setAttribute('aria-label', one[1] || ''); button.title = one[1] || '';
                button.innerHTML = one[2];
                bar.appendChild(button);
            });
            list.appendChild(bar);
        }
        // نص الرد اللي فوق شريط التقييم
        function answerOf(bar) {
            var node = bar.previousElementSibling;
            while (node && !(node.classList.contains('sai__row--bot'))) {
                if (node.classList.contains('sai__row--me')) return '';
                node = node.previousElementSibling;
            }
            var msg = node ? node.querySelector('.sai__msg') : null;
            return msg ? Array.prototype.map.call(msg.querySelectorAll('p'), function (p) { return p.textContent; }).join('\n') : '';
        }
        function post(url, data) {
            url = String(url || '');
            if (!url || url.charAt(0) === '#') return Promise.resolve({});
            var token = document.querySelector('meta[name="csrf-token"]');
            return fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': token ? token.getAttribute('content') : '', 'X-Requested-With': 'XMLHttpRequest' },
                body: JSON.stringify(data)
            }).then(function (response) {
                if (!response.ok) throw new Error('failed');
                return response.json().catch(function () { return {}; });
            });
        }
        function sendFeedback(bar, value, reason) {
            var data = { id: bar.getAttribute('data-ai-fb') || '', value: value, reason: reason || '', text: answerOf(bar), session: session };
            if (!panel.dispatchEvent(new CustomEvent('shary:ai-feedback', { bubbles: true, cancelable: true, detail: data }))) return;
            post(contact.feedback, data).catch(function () { /* التقييم مش بيوقف العميل */ });
        }
        // الموبايل: أرقام بس من غير الصفر الأول — مصر: 10 أرقام بتبدأ بـ 10 / 11 / 12 / 15 ، باقي الدول: 6 إلى 12 رقم. بيرجّع '' لو الرقم غلط
        function cleanPhone(code, raw) {
            var digits = String(raw || '').replace(/[٠-٩]/g, function (digit) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(digit); }).replace(/\D+/g, '');
            var prefix = String(code).replace(/\D+/g, '');
            if (prefix && digits.indexOf('00' + prefix) === 0) digits = digits.slice(prefix.length + 2);
            digits = digits.replace(/^0+/, '');
            if (code === '+20' && digits.length === 12 && digits.indexOf('20') === 0) digits = digits.slice(2);
            return (code === '+20' ? /^1[0125]\d{8}$/.test(digits) : /^\d{6,12}$/.test(digits)) ? digits : '';
        }
        // "خلّي مستشار يكلمك": اسم + موبايل جوه الشات (lead)
        function leadBlock(info) {
            info = info && typeof info === 'object' ? info : {};
            var L = U.lead || {};
            var box = make('div', 'sai__blk sai__lead');
            var head = make('div', 'sai__lead-head');
            var icon = make('span', 'sai__book-icon'); icon.innerHTML = ICONS.phone;
            var title = make('span', 'min-w-0');
            title.appendChild(make('b', '', info.title || L.title || ''));
            title.appendChild(make('small', '', info.text || L.text || ''));
            head.appendChild(icon); head.appendChild(title);
            box.appendChild(head);
            var fields = make('div', 'sai__fields');
            var name = make('input'); name.type = 'text'; name.autocomplete = 'name'; name.placeholder = B.name || ''; name.setAttribute('aria-label', B.name || ''); name.setAttribute('data-lead-name', '');
            name.setAttribute('value', saved.name);
            var phoneRow = make('div', 'sai__phone'); phoneRow.dir = 'ltr';
            var code = make('select'); code.setAttribute('aria-label', B.code || ''); code.setAttribute('data-lead-code', '');
            countries.forEach(function (country) {
                var option = make('option', '', country.code + '  ' + country.name); option.value = country.code;
                if (country.code === saved.code && !code.querySelector('[selected]')) option.setAttribute('selected', '');
                code.appendChild(option);
            });
            var phone = make('input'); phone.type = 'tel'; phone.dir = 'ltr'; phone.autocomplete = 'tel-national'; phone.inputMode = 'tel'; phone.placeholder = B.phone || ''; phone.setAttribute('aria-label', B.phone || ''); phone.setAttribute('data-lead-phone', '');
            phone.setAttribute('value', saved.phone);
            if (countries.length) phoneRow.appendChild(code);
            phoneRow.appendChild(phone);
            var error = make('p', 'sai__book-error hidden');
            var go = make('button', 'sai__book-go', L.go || ''); go.type = 'button'; go.setAttribute('data-ai-lead-go', '');
            fields.appendChild(name); fields.appendChild(phoneRow); fields.appendChild(error); fields.appendChild(go);
            box.appendChild(fields);
            list.appendChild(box);
        }
        function submitLead(go) {
            var box = go.closest('.sai__lead');
            if (!box || go.disabled) return;
            var L = U.lead || {};
            var nameField = box.querySelector('[data-lead-name]');
            var phoneField = box.querySelector('[data-lead-phone]');
            var codeField = box.querySelector('[data-lead-code]');
            var error = box.querySelector('.sai__book-error');
            function fail(text, field) { error.textContent = text || ''; error.classList.remove('hidden'); if (field) field.focus(); }
            saved.name = nameField.value; saved.phone = phoneField.value; if (codeField) saved.code = codeField.value;
            var name = saved.name.replace(/\s+/g, ' ').trim();
            if (name.length < 2) return fail(B.err_name, nameField);
            var digits = cleanPhone(saved.code, saved.phone);
            if (!digits) return fail(B.err_phone, phoneField);
            error.classList.add('hidden');
            go.disabled = true; go.textContent = L.sending || B.sending || '';
            var data = { name: name, phone: digits, country_code: saved.code, message: lastText, source: 'shary-ai', answers: plainAnswers(), context: context, session: session };
            var finished = false;
            function done(ok, message) {
                if (finished) return;
                finished = true;
                if (ok === false) { go.disabled = false; go.textContent = L.go || ''; return fail(message || B.err_send); }
                var okBox = make('div', 'sai__booked');
                var okHead = make('div', 'sai__booked-head');
                var mark = make('span'); mark.innerHTML = ICONS.check;
                okHead.appendChild(mark); okHead.appendChild(make('b', '', L.done_title || ''));
                okBox.appendChild(okHead);
                okBox.appendChild(make('p', 'sai__booked-note', message || String(L.done || '').replace(':name', name)));
                if (box.parentNode) box.parentNode.replaceChild(okBox, box);
                save();
            }
            if (!panel.dispatchEvent(new CustomEvent('shary:ai-lead', { bubbles: true, cancelable: true, detail: { data: data, done: done } }))) return;
            var url = String(contact.lead || '');
            if (!url || url.charAt(0) === '#') { window.setTimeout(function () { done(true); }, 500); return; }   // معاينة من غير سيرفر
            post(url, data).then(function (result) { done(true, result && result.message); }).catch(function () { done(false); });
        }
        // ---------- حجز الميتنج جوه الشات ----------
        // آخر كروت اتعرضت في المحادثة (عشان "الميتنج بخصوص إيه؟") — من الصفحة نفسها عشان تفضل شغالة بعد استرجاع المحادثة
        function lastSubjects() {
            var wraps = list.querySelectorAll('.sai__cards');
            if (!wraps.length) return [];
            return Array.prototype.map.call(wraps[wraps.length - 1].querySelectorAll('[data-subject]'), function (node) {
                try { var one = JSON.parse(node.getAttribute('data-subject')); return one && one.name ? one : null; } catch (error) { return null; }
            }).filter(Boolean);
        }
        function two(number) { return (number < 10 ? '0' : '') + number; }
        function subjectOf(item) {
            if (!item) return null;
            var name = item.title || item.name || '';
            return name ? { name: name, type: item.type === 'project' ? 'project' : 'unit', url: item.url || '' } : null;
        }
        // مواعيد اليوم: كل المواعيد مفتوحة (من غير قفل أي ميعاد) — القفل بس لو السيرفر رجّع available: false من contact.slots
        function slotsOf() {
            return times.map(function (slot) { return { value: slot.value, label: slot.label, off: false }; });
        }
        function dayList() {
            var locale = english ? 'en-GB' : 'ar-EG-u-nu-latn';
            var now = new Date();
            var out = [];
            for (var index = 0; index < 7; index += 1) {
                var day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + index);
                var value = day.getFullYear() + '-' + two(day.getMonth() + 1) + '-' + two(day.getDate());
                var weekday = day.toLocaleDateString(locale, { weekday: 'long' });
                out.push({ value: value, name: index === 0 ? (B.today || weekday) : (index === 1 ? (B.tomorrow || weekday) : weekday), weekday: weekday, date: day.toLocaleDateString(locale, { day: 'numeric', month: 'short' }) });
            }
            return out;
        }
        function wantsMeeting(text) {
            var lower = String(text).toLowerCase();
            return (Array.isArray(B.words) ? B.words : []).some(function (word) { return word && lower.indexOf(String(word).toLowerCase()) > -1; });
        }
        function dropBook() {
            if (!book) return;
            [book.box, book.intro].forEach(function (node) { if (node && node.parentNode) node.parentNode.removeChild(node); });
            book = null;
        }
        function startMeeting(item, keep) {
            showChat();
            dropBook();   // حجز واحد شغال في المرة
            var subject = subjectOf(item);
            var state = keep || { subject: subject, asked: !subject && lastSubjects().length > 0, type: '', day: null, time: null, slots: null };
            var text = state.subject ? String(B.intro_about || '').replace(':name', state.subject.name) : (B.intro || '');
            var introRow = null;
            if (text) { bubble(text, false); introRow = list.lastElementChild; }
            book = { box: make('div', 'sai__book'), intro: introRow, state: state };
            list.appendChild(book.box);
            renderBook();
            toBottom();
        }
        function bookStep(question, hint) {
            var head = make('p', 'sai__q');
            head.appendChild(make('b', '', question || ''));
            if (hint) head.appendChild(make('span', '', hint));
            book.box.appendChild(head);
        }
        function bookOptions(items, isOnItem, onPick, className) {
            var wrap = make('div', className || 'sai__opts');
            items.forEach(function (item) {
                var button = make('button', isOnItem(item) ? 'is-on' : '');
                button.type = 'button';
                if (item.sub) { button.appendChild(make('span', '', item.label)); button.appendChild(make('small', '', item.sub)); } else button.textContent = item.label;
                if (item.off) button.disabled = true;
                button.addEventListener('click', function () { onPick(item); renderBook(); toBottom(); });
                wrap.appendChild(button);
            });
            book.box.appendChild(wrap);
            return wrap;
        }
        function loadSlots(state) {
            state.slots = null;
            if (!contact.slots || !state.day) { state.slots = state.day ? slotsOf(state.day.value) : null; return; }
            var day = state.day;
            fetch(contact.slots + (contact.slots.indexOf('?') > -1 ? '&' : '?') + 'date=' + encodeURIComponent(day.value) + '&type=' + encodeURIComponent(state.type), { headers: { 'Accept': 'application/json' } })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                    var rows = data && Array.isArray(data.slots) ? data.slots : null;
                    return rows ? rows.map(function (slot) { return { value: slot.value, label: slot.label || slot.value, off: slot.available === false }; }) : slotsOf(day.value);
                })
                .catch(function () { return slotsOf(day.value); })
                .then(function (rows) {
                    if (!book || book.state !== state || state.day !== day) return;
                    state.slots = rows;
                    renderBook(); toBottom();
                });
        }
        function renderBook() {
            if (!book) return;
            var state = book.state;
            var box = book.box;
            box.textContent = '';
            var head = make('div', 'sai__book-head');
            var icon = make('span', 'sai__book-icon'); icon.innerHTML = ICONS.calendar;
            var title = make('span', 'min-w-0');
            title.appendChild(make('b', '', B.title || T.meet || ''));
            if (state.subject || !state.asked) title.appendChild(make('small', '', state.subject ? state.subject.name : (B.general || '')));
            head.appendChild(icon); head.appendChild(title);
            box.appendChild(head);

            // 1) بخصوص إيه؟ (لو فيه كروت معروضة والعميل ما حددش)
            if (state.asked) {
                bookStep(B.subject);
                var subjects = lastSubjects().map(function (one) { return { label: one.name, subject: one }; }).slice(0, 4);
                subjects.push({ label: B.general || '', subject: null, general: true });
                bookOptions(subjects, function (item) { return state.picked && (item.general ? !state.subject : (state.subject && state.subject.name === item.label)); }, function (item) {
                    state.subject = item.subject; state.picked = true;
                    if (!state.subject && state.type === 'site_visit') state.type = '';
                });
                if (!state.picked) return;
            }
            // 2) نوع الميتنج (زيارة الموقع بس لو فيه وحدة أو مشروع)
            bookStep(B.type);
            var names = B.types || {};
            var kinds = ['zoom', 'in_person', 'site_visit'].filter(function (key) { return names[key] && (key !== 'site_visit' || state.subject); }).map(function (key) { return { value: key, label: names[key] }; });
            bookOptions(kinds, function (item) { return state.type === item.value; }, function (item) { state.type = item.value; if (contact.slots && state.day) loadSlots(state); });
            if (!state.type) return;
            // 3) اليوم
            bookStep(B.day);
            bookOptions(dayList().map(function (day) { return { value: day.value, label: day.name, sub: day.date, day: day }; }), function (item) { return state.day && state.day.value === item.value; }, function (item) {
                state.day = item.day; state.time = null; loadSlots(state);
            }, 'sai__days');
            if (!state.day) return;
            // 4) الساعة
            bookStep(B.time);
            if (!state.slots) { box.appendChild(make('p', 'sai__booked-note', B.loading || '')); return; }
            if (!state.slots.some(function (slot) { return !slot.off; })) { box.appendChild(make('p', 'sai__book-error', B.no_slots || '')); return; }
            bookOptions(state.slots, function (item) { return state.time && state.time.value === item.value; }, function (item) { state.time = item; });
            if (!state.time) return;
            // 5) الاسم والموبايل
            bookStep(B.contact);
            var fields = make('div', 'sai__fields');
            var name = make('input'); name.type = 'text'; name.autocomplete = 'name'; name.placeholder = B.name || ''; name.setAttribute('aria-label', B.name || ''); name.value = saved.name;
            name.addEventListener('input', function () { saved.name = name.value; });
            var phoneRow = make('div', 'sai__phone'); phoneRow.dir = 'ltr';
            var code = make('select'); code.setAttribute('aria-label', B.code || '');
            countries.forEach(function (country) { var option = make('option', '', country.code + '  ' + country.name); option.value = country.code; code.appendChild(option); });
            code.value = saved.code;
            code.addEventListener('change', function () { saved.code = code.value; });
            var phone = make('input'); phone.type = 'tel'; phone.dir = 'ltr'; phone.autocomplete = 'tel-national'; phone.inputMode = 'tel'; phone.placeholder = B.phone || ''; phone.setAttribute('aria-label', B.phone || ''); phone.value = saved.phone;
            phone.addEventListener('input', function () { saved.phone = phone.value; });
            if (countries.length) phoneRow.appendChild(code);
            phoneRow.appendChild(phone);
            var error = make('p', 'sai__book-error hidden');
            var go = make('button', 'sai__book-go', B.confirm || ''); go.type = 'button';
            go.addEventListener('click', function () { submitBook(go, error, name, phone); });
            [name, phone].forEach(function (field) { field.addEventListener('keydown', function (event) { if (event.key === 'Enter') { event.preventDefault(); submitBook(go, error, name, phone); } }); });
            fields.appendChild(name); fields.appendChild(phoneRow); fields.appendChild(error); fields.appendChild(go);
            box.appendChild(fields);
        }
        function submitBook(go, error, nameField, phoneField) {
            if (!book || go.disabled) return;
            var state = book.state;
            function fail(text, field) { error.textContent = text || ''; error.classList.remove('hidden'); if (field) field.focus(); toBottom(); }
            var name = saved.name.replace(/\s+/g, ' ').trim();
            if (name.length < 2) return fail(B.err_name, nameField);
            var digits = cleanPhone(saved.code, saved.phone);
            if (!digits) return fail(B.err_phone, phoneField);
            error.classList.add('hidden');
            go.disabled = true; go.textContent = B.sending || '';
            var data = {
                meeting_type: state.type, meeting_date: state.day.value, meeting_time: state.time.value, name: name, phone: digits, country_code: saved.code,
                subject: state.subject ? state.subject.name : '', subject_type: state.subject ? state.subject.type : 'general', subject_url: state.subject ? state.subject.url : '',
                source: 'shary-ai', answers: plainAnswers(), context: context, session: session
            };
            var finished = false;
            function done(ok, message) {
                if (finished) return;
                finished = true;
                if (!book || book.state !== state) return;
                if (ok === false) { go.disabled = false; go.textContent = B.confirm || ''; return fail(message || B.err_send); }
                booked(data, state, message);
            }
            var proceed = panel.dispatchEvent(new CustomEvent('shary:ai-meeting', { bubbles: true, cancelable: true, detail: { data: data, done: done } }));
            if (!proceed) return;
            var url = String(contact.meeting || '');
            if (!url || url.charAt(0) === '#') { window.setTimeout(function () { done(true); }, 500); return; }   // معاينة من غير سيرفر
            var token = document.querySelector('meta[name="csrf-token"]');
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': token ? token.getAttribute('content') : '', 'X-Requested-With': 'XMLHttpRequest' },
                body: JSON.stringify(data)
            }).then(function (response) {
                if (!response.ok) throw new Error('failed');
                return response.json().catch(function () { return {}; });
            }).then(function (result) { done(true, result && result.message); })
              .catch(function () { done(false); });
        }
        // كارت التأكيد مكان كارت الحجز + رسالة تأكيد
        function booked(data, state, message) {
            var kind = (B.types || {})[data.meeting_type] || '';
            var when = state.day.weekday + ' ' + state.day.date;
            var box = make('div', 'sai__booked');
            var head = make('div', 'sai__booked-head');
            var mark = make('span'); mark.innerHTML = ICONS.check;
            head.appendChild(mark); head.appendChild(make('b', '', B.done_title || ''));
            box.appendChild(head);
            var rows = make('dl');
            [[B.row_type, kind], [B.row_when, when + ' — ' + state.time.label], [B.row_about, data.subject || B.general], [B.row_who, data.name]].forEach(function (pair) {
                var line = make('div');
                line.appendChild(make('dt', '', pair[0] || ''));
                line.appendChild(make('dd', '', pair[1] || ''));
                rows.appendChild(line);
            });
            box.appendChild(rows);
            var note = (B.notes || {})[data.meeting_type];
            if (note) box.appendChild(make('p', 'sai__booked-note', note));
            var ways = make('div', 'sai__ways');
            var wa = action('sai__way--wa', B.whatsapp || T.whatsapp, '', waLink([B.wa_text, kind, when + ' — ' + state.time.label, data.subject || B.general, data.name, data.subject_url].filter(Boolean).join('\n')));
            wa.insertAdjacentHTML('afterbegin', '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>');
            ways.appendChild(wa);
            var edit = action('sai__way--edit', B.edit || '', ICONS.calendar, '');
            edit.setAttribute('data-ai-rebook', JSON.stringify({ subject: state.subject, type: state.type }));
            ways.appendChild(edit);
            box.appendChild(ways);
            if (book.box.parentNode) book.box.parentNode.replaceChild(box, book.box);
            book = null;
            bubble(message || String(B.done || '').replace(':name', data.name).replace(':type', kind).replace(':day', when).replace(':time', state.time.label), false);
            toBottom();
            save();
        }

        function meeting() {
            var box = make('div', 'sai__meet');
            var text = make('div', 'sai__meet-text');
            text.appendChild(make('b', '', T.meet_title || ''));
            text.appendChild(make('span', '', T.meet_text || ''));
            box.appendChild(text);
            box.appendChild(meetButton(T.meet, 'sai__meet-btn', null));
            list.appendChild(box);
        }
        function chips(items) {
            if (!chipsBox) return;
            chipsBox.textContent = '';
            (Array.isArray(items) ? items : []).forEach(function (text) {
                var button = make('button', '', text);
                button.type = 'button';
                button.addEventListener('click', function () { send(text); });
                chipsBox.appendChild(button);
            });
            chipsBox.classList.toggle('hidden', !chipsBox.children.length || scroll.classList.contains('hidden'));
        }
        function grow() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 96) + 'px'; }

        // رد المعاينة (من غير سيرفر): لو الرسالة فيها كلمة من sample.intents[].words بيرجع الرد ده — وإلا الرد الأساسي
        function sampleFor(text) {
            var sample = config.sample;
            if (!sample) return null;
            var lower = String(text).toLowerCase();
            var hit = (Array.isArray(sample.intents) ? sample.intents : []).filter(function (one) {
                return one && (one.words || []).some(function (word) { return word && lower.indexOf(String(word).toLowerCase()) > -1; });
            })[0];
            return hit || sample;
        }
        // الرد على مراحل (ndjson / event-stream): كل سطر JSON — status / delta / وباقي المفاتيح بتتجمع في الرد الأخير
        function readStream(reader, onStatus, onDelta) {
            var decoder = new TextDecoder();
            var buffer = '';
            var last = {};
            function line(raw) {
                raw = String(raw).replace(/^data:\s*/, '').trim();
                if (!raw || raw === '[DONE]' || raw.charAt(0) === ':' || /^(event|id|retry):/.test(raw)) return;
                var item = null;
                try { item = JSON.parse(raw); } catch (error) { item = null; }
                if (!item || typeof item !== 'object') return;
                if (item.status) onStatus(item.status);
                if (item.delta) onDelta(item.delta);
                Object.keys(item).forEach(function (key) { if (key !== 'status' && key !== 'delta') last[key] = item[key]; });
            }
            function pump() {
                return reader.read().then(function (chunk) {
                    if (chunk.done) { if (buffer) line(buffer); return last; }
                    buffer += decoder.decode(chunk.value, { stream: true });
                    var parts = buffer.split(/\r?\n/);
                    buffer = parts.pop();
                    parts.forEach(line);
                    return pump();
                });
            }
            return pump();
        }

        // again = إعادة المحاولة بعد خطأ (من غير ما رسالة العميل تتكرر)
        function send(text, extra, again) {
            text = String(text || '').trim();
            if (!text || busy) return;
            showChat();
            if (!again) bubble(text, true);
            input.value = ''; grow();
            // العميل طالب ميتنج: الحجز بيبدأ على طول جوه الشات
            if (!extra && !again && wantsMeeting(text)) { startMeeting(null); return; }
            lastText = text;
            busy = true;
            form.classList.add('is-busy');
            if (sendButton) sendButton.setAttribute('aria-label', U.stop || '');
            var anchor = list.lastElementChild;   // رسالة العميل — الرد بيبدأ بعدها

            var typingCol = row(false);
            var typing = make('div', 'sai__msg sai__msg--bot sai__typing');
            typing.setAttribute('aria-label', T.typing || '');
            typing.innerHTML = '<i></i><i></i><i></i>';
            var statusNode = make('span', 'sai__status', '');
            typing.appendChild(statusNode);
            typingCol.appendChild(typing);
            toBottom();

            // حالات الانتظار: بتتغير لوحدها لحد ما السيرفر يبعت status بنفسه
            var steps = Array.isArray(U.steps) ? U.steps : [];
            var stepIndex = 0;
            var manual = false;
            function nextStep() { if (manual || !steps.length) return; statusNode.textContent = steps[Math.min(stepIndex, steps.length - 1)]; stepIndex += 1; }
            var first = window.setTimeout(nextStep, 350);
            var timer = window.setInterval(nextStep, 1300);

            var done = false;
            var live = null;       // رسالة بتتكتب قدام العميل (stream)
            var liveText = '';
            var controller = window.AbortController ? new AbortController() : null;

            function dropTyping() {
                var line = typingCol.parentNode;
                if (line && line.parentNode) line.parentNode.removeChild(line);
            }
            function status(value) {
                if (done || !value) return;
                manual = true;
                statusNode.textContent = String(value);
            }
            function stream(delta) {
                if (done || !delta) return;
                if (!live) { dropTyping(); live = bubble('', false, true); live.classList.add('sai__msg--live'); }
                var follow = scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 90;
                liveText += String(delta);
                live.textContent = '';
                fill(live, liveText);
                if (follow) toBottom();
            }
            function reply(answer, more) {
                if (done) return;
                done = true; busy = false; stopNow = null;
                window.clearTimeout(first); window.clearInterval(timer);
                form.classList.remove('is-busy');
                if (sendButton) sendButton.setAttribute('aria-label', sendLabel);
                dropTyping();
                more = more || {};
                var textOut = answer || liveText;
                var node = live;
                if (live) { live.classList.remove('sai__msg--live'); live.textContent = ''; fill(live, textOut); }
                else if (textOut) node = bubble(textOut, false, true);
                if (node && more.id != null) node.closest('.sai__row').setAttribute('data-id', String(more.id));
                if (more.error) {
                    // خطأ في الاتصال: رسالة + "حاول تاني" (بتبعت نفس السؤال من غير تكرار)
                    var err = make('div', 'sai__err');
                    err.appendChild(make('span', '', T.error || ''));
                    var retry = make('button', '', U.retry || ''); retry.type = 'button';
                    retry.setAttribute('data-ai-retry', text);
                    if (extra) retry.setAttribute('data-steps', '1');
                    err.appendChild(retry);
                    list.appendChild(err);
                } else {
                    if (Array.isArray(more.criteria)) { understood = more.criteria.filter(Boolean).map(String); renderCriteria(); }
                    statsBlock(more.stats);
                    cards(more.cards, more.results);
                    compareBlock(more.compare);
                    sourcesBlock(more.sources);
                    optionsBlock(more.options);
                    actionsBlock(more.actions);
                    if (more.meeting) meeting();
                    if (more.lead) leadBlock(more.lead);
                    if (more.feedback !== false && (textOut || (Array.isArray(more.cards) && more.cards.length))) feedbackBar(more.id);
                    if (Array.isArray(more.chips)) chips(more.chips);
                    if (more.session) session = more.session;
                }
                // الرد بيبدأ من فوق: أول حاجة في الرد (النص وأول كارت) — مش آخر كارت
                var top = anchor && anchor.parentNode === list ? anchor.nextElementSibling : list.firstElementChild;
                if (more.book) startMeeting(typeof more.book === 'object' ? more.book : null);
                else toNode(top);
                save();
            }
            function fail() { reply('', { error: true }); }
            // "إيقاف": اللي اتكتب بيفضل ، والطلب بيتلغي
            stopNow = function () {
                if (controller) { try { controller.abort(); } catch (error) { /* اتلغى */ } }
                reply(liveText ? '' : (U.stopped || ''), { feedback: false });
            };

            var answersNow = (extra && extra.answers) || plainAnswers();
            var detail = {
                text: text, answers: answersNow, context: context, session: session, lang: english ? 'en' : 'ar', via: extra ? 'steps' : 'text',
                reply: reply, status: status, stream: stream, fail: fail, signal: controller ? controller.signal : null, sample: sampleFor(text)
            };
            var go = panel.dispatchEvent(new CustomEvent('shary:ai-send', { bubbles: true, cancelable: true, detail: detail }));
            if (!go) return;

            var endpoint = panel.getAttribute('data-endpoint');
            if (!endpoint) {
                // من غير سيرفر (معاينة): الرد التجريبي لو موجود
                window.setTimeout(function () { reply(detail.sample && detail.sample.reply ? detail.sample.reply : '', detail.sample || {}); }, 1500);
                return;
            }
            var token = document.querySelector('meta[name="csrf-token"]');
            fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, application/x-ndjson, text/event-stream', 'X-CSRF-TOKEN': token ? token.getAttribute('content') : '', 'X-Requested-With': 'XMLHttpRequest' },
                body: JSON.stringify({ message: text, answers: answersNow, context: context, session: session, lang: detail.lang, via: detail.via, page: window.location.pathname }),
                signal: controller ? controller.signal : undefined
            }).then(function (response) {
                if (!response.ok) throw new Error('failed');
                var kind = response.headers.get('Content-Type') || '';
                if (/ndjson|event-stream/.test(kind) && response.body && response.body.getReader && window.TextDecoder) return readStream(response.body.getReader(), status, stream);
                return response.json();
            }).then(function (data) { data = data || {}; reply(data.reply || '', data); })
              .catch(fail);
        }

        function restart() {
            if (stopNow) stopNow();
            answers = {}; session = ''; busy = false; stepsShown = 0; book = null; understood = []; lastText = '';
            form.classList.remove('is-busy');
            list.textContent = '';
            input.value = ''; grow();
            scroll.classList.add('hidden');
            if (chipsBox) chipsBox.classList.add('hidden');
            if (critBox) critBox.classList.add('hidden');
            if (onb) { onb.classList.remove('hidden'); onb.scrollTop = 0; }
            chips(config.chips);
            renderSteps();
            onbLabels();
            save();
        }

        // ---------- حفظ المحادثة (ديسك توب): النافذة بتفضل مفتوحة بنفس الكلام والعميل بيتنقل بين الصفحات ----------
        function save() {
            try {
                var copy = list.cloneNode(true);
                Array.prototype.forEach.call(copy.querySelectorAll('.sai__book, .sai__typing'), function (node) {
                    var row = node.classList.contains('sai__typing') ? node.closest('.sai__row') : node;
                    if (row && row.parentNode) row.parentNode.removeChild(row);
                });
                window.sessionStorage.setItem(STORE, JSON.stringify({
                    open: !panel.classList.contains('hidden'), chat: !scroll.classList.contains('hidden'), html: copy.innerHTML,
                    chips: chipsBox ? Array.prototype.map.call(chipsBox.children, function (button) { return button.textContent; }) : [],
                    answers: answers, session: session, lang: english ? 'en' : 'ar', top: scroll.scrollTop, understood: understood, last: lastText
                }));
            } catch (error) { /* التخزين مقفول */ }
        }
        function restore() {
            var state = null;
            try { state = JSON.parse(window.sessionStorage.getItem(STORE) || 'null'); } catch (error) { state = null; }
            if (!state || state.lang !== (english ? 'en' : 'ar')) return;
            answers = state.answers || {};
            session = state.session || '';
            understood = Array.isArray(state.understood) ? state.understood : [];
            lastText = state.last || '';
            if (state.chat) {
                list.innerHTML = state.html || '';
                showChat();
                if (Array.isArray(state.chips) && state.chips.length) chips(state.chips);
                if (window.SharyCards) window.SharyCards.refresh(list);
                scroll.scrollTop = state.top || 0;
            } else renderSteps();
            // ديسك توب بس: النافذة بترجع مفتوحة لوحدها في الصفحة الجديدة — على نفس المكان اللي العميل كان واقف عنده
            if (state.open && wide.matches && !panel.closest('[hidden]')) { open(null); if (state.chat) scroll.scrollTop = state.top || 0; }
        }

        function open(from) {
            if (!panel.classList.contains('hidden')) return;
            opener = from || null;
            panel.classList.remove('hidden');
            if (!wide.matches) {
                document.documentElement.style.overflow = 'hidden';
                // موبايل: زرار الرجوع بيقفل الصفحة دي والعميل بيفضل في صفحته
                if (window.SharyBack) { window.SharyBack.opened(close); panel.__back = true; }
            }
            save();
        }
        function close() {
            if (panel.classList.contains('hidden')) return;
            panel.classList.add('hidden');
            document.documentElement.style.overflow = '';
            if (opener) { try { opener.focus({ preventScroll: true }); } catch (error) { /* العنصر اتشال */ } }
            if (panel.__back && window.SharyBack) window.SharyBack.closed();
            panel.__back = false;
            save();
        }
        panel.sharyOpen = open;
        panel.sharyClose = close;
        // تغيير سياق الصفحة من بره (زرار عليه data-ai-context) — من غير قيمة بيرجع لسياق الصفحة الأصلي ($aiContext)
        panel.sharyContext = function (value) {
            context = value && value.name ? value : (config.context && config.context.name ? config.context : null);
            renderContext();
        };
        // سؤال جاهز من بره (زرار عليه data-ai-ask="السؤال")
        panel.sharyAsk = function (text) { send(text); };

        panel.querySelectorAll('[data-ai-close]').forEach(function (node) { node.addEventListener('click', close); });
        // لينك كارت (صفحة الوحدة / المشروع): صفحة Shary AI بتتقفل والعميل بيروح للصفحة
        list.addEventListener('click', function (event) {
            if (!event.target.closest) return;
            // "اعرض كمان": باقي الكروت بتظهر مكانها
            var moreCards = event.target.closest('[data-ai-more]');
            if (moreCards) {
                var holder = moreCards.closest('.sai__cards');
                Array.prototype.forEach.call(holder ? holder.querySelectorAll('.sai__card[hidden]') : [], function (node) { node.hidden = false; });
                if (moreCards.parentNode) moreCards.parentNode.removeChild(moreCards);
                save();
                return;
            }
            // "حاول تاني" بعد خطأ الاتصال
            var retry = event.target.closest('[data-ai-retry]');
            if (retry) {
                var again = retry.getAttribute('data-ai-retry');
                var fromSteps = retry.hasAttribute('data-steps');
                var errBox = retry.closest('.sai__err');
                if (errBox && errBox.parentNode) errBox.parentNode.removeChild(errBox);
                send(again, fromSteps ? { answers: plainAnswers() } : null, true);
                return;
            }
            // التقييم: 👍 / 👎 (+ السبب) / نسخ
            var fb = event.target.closest('[data-fb]');
            if (fb) {
                var bar = fb.closest('.sai__fb');
                var kind = fb.getAttribute('data-fb');
                if (kind === 'copy') {
                    var copied = answerOf(bar);
                    var okCopy = function () { fb.classList.add('is-on'); window.setTimeout(function () { fb.classList.remove('is-on'); }, 1400); };
                    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(copied).then(okCopy, function () { /* النسخ مقفول */ });
                    return;
                }
                var note = bar.querySelector('.sai__fb-why');
                if (note) bar.removeChild(note);
                if (kind === 'reason') {
                    sendFeedback(bar, 'down', fb.textContent);
                    bar.appendChild(make('p', 'sai__fb-why', U.fb_thanks || ''));
                } else {
                    Array.prototype.forEach.call(bar.querySelectorAll('[data-fb="up"], [data-fb="down"]'), function (button) { button.classList.toggle('is-on', button === fb); });
                    sendFeedback(bar, kind, '');
                    var reasons = Array.isArray(U.fb_reasons) ? U.fb_reasons : [];
                    var box = make('p', 'sai__fb-why', kind === 'down' && reasons.length ? (U.fb_ask || '') : (U.fb_thanks || ''));
                    if (kind === 'down') reasons.forEach(function (reason) { var one = make('button', '', reason); one.type = 'button'; one.setAttribute('data-fb', 'reason'); box.appendChild(one); });
                    bar.appendChild(box);
                }
                save();
                return;
            }
            var leadGo = event.target.closest('[data-ai-lead-go]');
            if (leadGo) { submitLead(leadGo); return; }
            // "احجز ميتنج" (تحت كارت أو في كارت المستشار) و "تعديل الميعاد": بالتفويض عشان يشتغلوا بعد استرجاع المحادثة
            var meet = event.target.closest('[data-ai-meet]');
            if (meet) {
                var subject = null;
                try { subject = JSON.parse(meet.getAttribute('data-ai-meet') || 'null'); } catch (error) { subject = null; }
                startMeeting(subject);
                return;
            }
            var again = event.target.closest('[data-ai-rebook]');
            if (again) {
                var keep = {};
                try { keep = JSON.parse(again.getAttribute('data-ai-rebook') || '{}'); } catch (error) { keep = {}; }
                var done = again.closest('.sai__booked');
                if (done && done.parentNode) done.parentNode.removeChild(done);
                startMeeting(null, { subject: keep.subject || null, asked: false, type: keep.type || '', day: null, time: null, slots: null });
                return;
            }
            // لينك كارت (صفحة الوحدة / المشروع): على الموبايل صفحة Shary AI بتتقفل والعميل بيروح للصفحة — على الديسك توب النافذة بتفضل مفتوحة معاه
            var link = event.target.closest('a[href]');
            if (link && !link.target && !/^(tel:|mailto:|#)/.test(link.getAttribute('href'))) { if (wide.matches) save(); else close(); }
        });
        document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !wide.matches) close(); });
        // زرار جاهز جوه الصفحة (أسئلة الصفحة / السؤال التوضيحي / زراير الرد): الضغط بيبعت النص كرسالة
        panel.addEventListener('click', function (event) {
            var say = event.target.closest ? event.target.closest('[data-ai-say]') : null;
            if (say) { send(say.getAttribute('data-ai-say') || say.textContent); return; }
            if (event.target.closest && event.target.closest('[data-ai-edit]')) editCriteria();
        });
        form.addEventListener('submit', function (event) { event.preventDefault(); send(input.value); });
        // زرار الإرسال وقت الرد = "إيقاف"
        if (sendButton) sendButton.addEventListener('click', function (event) { if (busy && stopNow) { event.preventDefault(); stopNow(); } });
        window.addEventListener('pagehide', function () { if (list.children.length) save(); });
        input.addEventListener('input', grow);
        input.addEventListener('keydown', function (event) { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(input.value); } });
        if (startButton) startButton.addEventListener('click', function () { if (!startButton.disabled) send(queryText(), { answers: plainAnswers() }); });
        if (skipButton) skipButton.addEventListener('click', function () { showChat(); if (!wide.matches || list.children.length < 2) input.focus(); });

        var reset = panel.querySelector('[data-ai-reset]');
        if (reset) {
            reset.addEventListener('click', function () {
                if (list.children.length > 1 && T.reset_confirm && !window.confirm(T.reset_confirm)) return;
                restart();
            });
        }

        // الإملاء الصوتي (لو المتصفح بيدعمه)
        var mic = panel.querySelector('[data-ai-mic]');
        var Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (mic && Speech) {
            mic.classList.remove('hidden');
            var listening = null;
            mic.addEventListener('click', function () {
                if (listening) { listening.stop(); return; }
                var recognition = new Speech();
                recognition.lang = english ? 'en-US' : 'ar-EG';
                recognition.onresult = function (event) { input.value = event.results[0][0].transcript; grow(); input.focus(); };
                recognition.onend = recognition.onerror = function () { listening = null; mic.setAttribute('aria-pressed', 'false'); };
                listening = recognition;
                mic.setAttribute('aria-pressed', 'true');
                try { recognition.start(); } catch (error) { listening = null; mic.setAttribute('aria-pressed', 'false'); }
            });
        }

        chips(config.chips);
        renderSteps();
        renderContext();
        // بعد ما الصفحة تجهز: رجّع المحادثة المحفوظة (ولو النافذة كانت مفتوحة على الديسك توب بتفتح لوحدها)
        window.setTimeout(restore, 300);
    });

    // أي زرار Shary AI بيفتح الصفحة الأقرب له
    document.addEventListener('click', function (event) {
        var opener = event.target.closest ? event.target.closest('[data-ask-ai]') : null;
        if (!opener) return;
        var scope = opener.closest('main');
        var panel = (scope && scope.querySelector('[data-ai-panel]')) || (opener.closest('[lang]') || document).querySelector('[data-ai-panel]');
        if (!panel || !panel.sharyOpen) return;
        event.preventDefault();
        // ديسك توب: الضغط على زرار Shary AI العايم والنافذة مفتوحة بيقفلها
        if (!panel.classList.contains('hidden') && opener.classList.contains('area-fab') && window.matchMedia('(min-width: 1024px)').matches) { panel.sharyClose(); return; }
        // السياق: من الزرار نفسه (data-ai-context='{"type":"project","id":"scenes","name":"سينز","url":"..."}' — مثلًا "اسأل Shary AI عن المشروع ده" على كارت)
        // أو من علامة الصفحة [data-ai-page-context] — وإلا سياق الصفحة الأصلي ($aiContext)
        var holder = opener.hasAttribute('data-ai-context') ? opener : (scope ? scope.querySelector('[data-ai-page-context]') : null);
        var value = null;
        if (holder) { try { value = JSON.parse(holder.getAttribute(holder === opener ? 'data-ai-context' : 'data-ai-page-context') || 'null'); } catch (error) { value = null; } }
        if (panel.sharyContext) panel.sharyContext(value);
        panel.sharyOpen(opener);
        // data-ai-ask="السؤال": الصفحة بتفتح والسؤال بيتبعت على طول
        var ask = opener.getAttribute('data-ai-ask');
        if (ask && panel.sharyAsk) panel.sharyAsk(ask);
    });
})();

/**
 * صفحة "التحقق من الوكيل" (resources/views/agents/verify.blade.php)
 * - الفورم [data-agent-form] GET عادي: من غير السكربت الصفحة بترجع بالنتيجة من السيرفر.
 * - السكربت بيتأكد إن الرقم مكتوب، وبعدها بيطلع حدث shary:agent-verify على الفورم:
 *       form.addEventListener('shary:agent-verify', function (event) {
 *           event.preventDefault();                       // هنجيب النتيجة AJAX
 *           // event.detail = { phone, country_code, show }
 *           event.detail.show({ found: true, agent: { name, role, email, phone, phone_display, whatsapp, image } });
 *           // أو: event.detail.show({ found: false });
 *       });
 *   لو الحدث ما اتمنعش الفورم بيتبعت عادي.
 * - "تحقق من رقم آخر" [data-agent-again] بيخفي النتيجة ويرجّع للخانة.
 */
(function () {
    document.querySelectorAll('[data-agent-verify]').forEach(function (box) {
        var form = box.querySelector('[data-agent-form]');
        if (!form) return;
        var input = form.querySelector('input[name="phone"]');
        var error = form.querySelector('[data-agent-error]');
        var found = box.querySelector('[data-agent-result="found"]');
        var missing = box.querySelector('[data-agent-result="missing"]');

        function text(root, name, value) {
            root.querySelectorAll('[data-agent-field="' + name + '"]').forEach(function (node) { node.textContent = value || ''; });
        }

        function show(result) {
            var ok = !!(result && result.found && result.agent);
            var checked = (result && result.checked) || (form.querySelector('[data-phone-value]').value + ' ' + input.value);
            found.classList.toggle('hidden', !ok);
            missing.classList.toggle('hidden', ok);
            box.setAttribute('data-state', ok ? 'found' : 'missing');
            if (ok) {
                var agent = result.agent;
                text(found, 'name', agent.name);
                text(found, 'role', agent.role);
                text(found, 'email', agent.email);
                text(found, 'phone', agent.phone_display || agent.phone);
                found.querySelectorAll('[data-agent-link="email"]').forEach(function (a) { a.setAttribute('href', 'mailto:' + (agent.email || '')); });
                found.querySelectorAll('[data-agent-link="phone"]').forEach(function (a) { a.setAttribute('href', 'tel:' + (agent.phone || '')); });
                found.querySelectorAll('[data-agent-link="whatsapp"]').forEach(function (a) { a.setAttribute('href', 'https://wa.me/' + (agent.whatsapp || String(agent.phone || '').replace(/\D/g, ''))); });
                var photo = found.querySelector('[data-agent-photo]');
                var blank = found.querySelector('[data-agent-photo-blank]');
                if (photo) {
                    if (agent.image) photo.setAttribute('src', agent.image);
                    photo.setAttribute('alt', agent.name || '');
                    photo.classList.toggle('hidden', !agent.image);
                }
                if (blank) blank.classList.toggle('hidden', !!agent.image);
            } else {
                text(missing, 'checked', checked);
            }
            var card = ok ? found : missing;
            if (card.scrollIntoView) card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }

        form.addEventListener('submit', function (event) {
            var digits = input.value.replace(/\D/g, '');
            if (digits.length < 6) {   // رقم ناقص: رسالة تحت الخانة
                event.preventDefault();
                if (error) error.classList.remove('hidden');
                input.focus();
                return;
            }
            if (error) error.classList.add('hidden');
            var go = form.dispatchEvent(new CustomEvent('shary:agent-verify', {
                bubbles: true,
                cancelable: true,
                detail: { phone: input.value, country_code: form.querySelector('[data-phone-value]').value, show: show }
            }));
            if (!go) event.preventDefault();   // النتيجة هتيجي من اللي سمع الحدث (AJAX) بـ detail.show(...)
        });

        input.addEventListener('input', function () { if (error) error.classList.add('hidden'); });

        box.querySelectorAll('[data-agent-again]').forEach(function (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                found.classList.add('hidden');
                missing.classList.add('hidden');
                box.setAttribute('data-state', 'idle');
                input.value = '';
                input.focus();
                if (form.scrollIntoView) form.scrollIntoView({ block: 'center', behavior: 'smooth' });
            });
        });
    });
})();

/**
 * صفحة المفضلة وصفحة المقارنة (resources/views/saved/*.blade.php)
 * - التبويب [data-saved-tab="units | projects"] بيبدّل بين اللوحتين [data-saved-panel] من غير تحميل.
 * - المفضلة: القلب على أي كارت بيشيله من المفضلة — الكارت [data-saved-item] بيختفي والعدد بيتحدّث، ولو التبويب فضي بتظهر رسالة [data-saved-empty].
 *   زرار "قارن بين المحفوظ" [data-saved-compare]: بيحط أول 4 عناصر من التبويب المفتوح في المقارنة ويفتح صفحة المقارنة.
 * - المقارنة: زرار X [data-compare-remove="units/slug"] بيشيل العمود (كل الخلايا اللي عليها data-col بنفس القيمة) ومن المحفوظ على الجهاز.
 *   "مسح الكل" [data-compare-clear] بيفضي التبويب ، "الفروق فقط" [data-compare-diff] بيخفي الصفوف اللي قيمها متساوية ،
 *   وشارة الأفضل بتتحط على أقل / أكبر data-value في الصف اللي عليه data-compare-best="min | max" (النص من data-best-label).
 * - window.SharySaved.refresh(panel): بتحدّث العدد والرسالة والشارات بعد ما تضيفوا / تشيلوا عناصر بنفسكم (AJAX).
 */
(function () {
    // قيمة الخلية من غير شارة الأفضل
    function cellText(cell) {
        var copy = cell.cloneNode(true);
        Array.prototype.forEach.call(copy.querySelectorAll('.compare-best'), function (badge) { badge.parentNode.removeChild(badge); });
        return copy.textContent.replace(/\s+/g, ' ').trim();
    }

    // شارة الأفضل + تعليم الصفوف المتساوية (لـ "الفروق فقط")
    function mark(panel, table) {
        var different = 0;
        Array.prototype.forEach.call(table.querySelectorAll('.compare-row[data-compare-row]'), function (row) {
            var cells = Array.prototype.slice.call(row.querySelectorAll('.compare-cell'));
            cells.forEach(function (cell) {
                cell.classList.remove('is-best');
                Array.prototype.forEach.call(cell.querySelectorAll('.compare-best'), function (badge) { cell.removeChild(badge); });
            });
            var texts = cells.map(cellText);
            var same = cells.length < 2 || texts.every(function (value) { return value === texts[0]; });
            row.classList.toggle('is-same', same);
            if (!same) different++;

            var mode = row.getAttribute('data-compare-best');
            if (!mode || cells.length < 2) return;
            var values = cells.map(function (cell) { return parseFloat(cell.getAttribute('data-value')); });
            if (values.some(function (value) { return !(value > 0); })) return;   // قيمة ناقصة: مفيش شارة
            var best = mode === 'max' ? Math.max.apply(null, values) : Math.min.apply(null, values);
            if (values.every(function (value) { return value === best; })) return;
            cells.forEach(function (cell, index) {
                if (values[index] !== best) return;
                cell.classList.add('is-best');
                var badge = document.createElement('span');
                badge.className = 'compare-best';
                badge.textContent = row.getAttribute('data-best-label') || '';
                cell.appendChild(badge);
            });
        });
        var notice = panel.querySelector('[data-compare-same]');
        if (notice) notice.classList.toggle('hidden', !(table.hasAttribute('data-diff-only') && different === 0 && table.querySelectorAll('.compare-row--head .compare-cell').length > 1));
    }

    function refresh(panel) {
        var page = panel.closest('[data-saved-page]');
        var name = panel.getAttribute('data-saved-panel');
        var table = panel.querySelector('[data-compare-table]');
        var total = table ? table.querySelectorAll('.compare-row--head .compare-cell').length : panel.querySelectorAll('[data-saved-item]').length;
        page.querySelectorAll('[data-saved-count="' + name + '"]').forEach(function (badge) { badge.textContent = total; });
        var content = panel.querySelector('[data-saved-content]');
        var empty = panel.querySelector('[data-saved-empty]');
        if (content) content.classList.toggle('hidden', total === 0);
        if (empty) empty.classList.toggle('hidden', total > 0);
        if (table) table.style.setProperty('--cols', Math.max(total, 1));
        var hint = panel.querySelector('[data-compare-hint]');
        if (hint) hint.classList.toggle('hidden', total !== 1);

        // شريط الأدوات: العدد + إظهار / إخفاء الأزرار حسب العدد
        var actions = panel.querySelector('[data-saved-actions]');
        if (actions) actions.classList.toggle('hidden', total === 0);
        var count = panel.querySelector('[data-compare-total]');
        if (count) count.textContent = total;
        var diff = panel.querySelector('[data-compare-diff]');
        if (diff) {
            diff.classList.toggle('hidden', total < 2);
            if (total < 2 && table) { table.removeAttribute('data-diff-only'); diff.setAttribute('aria-pressed', 'false'); }
        }
        var add = panel.querySelector('[data-compare-add]');
        if (add) add.classList.toggle('hidden', total >= 4);
        if (table) mark(panel, table);
        syncCompareButton(page);
    }

    // "قارن بين المحفوظ" في المفضلة: بيظهر لو التبويب المفتوح فيه 2 أو أكتر
    function syncCompareButton(page) {
        var button = page.querySelector('[data-saved-compare]');
        if (!button) return;
        var open = page.querySelector('[data-saved-panel]:not(.hidden)');
        button.classList.toggle('hidden', !open || open.querySelectorAll('[data-saved-item]').length < 2);
    }
    window.SharySaved = { refresh: refresh };

    document.querySelectorAll('[data-saved-page]').forEach(function (page) {
        var tabs = Array.prototype.slice.call(page.querySelectorAll('[data-saved-tab]'));
        function open(name) {
            tabs.forEach(function (tab) { tab.setAttribute('aria-selected', tab.getAttribute('data-saved-tab') === name ? 'true' : 'false'); });
            page.querySelectorAll('[data-saved-panel]').forEach(function (panel) { panel.classList.toggle('hidden', panel.getAttribute('data-saved-panel') !== name); });
            syncCompareButton(page);
        }
        tabs.forEach(function (tab) { tab.addEventListener('click', function () { open(tab.getAttribute('data-saved-tab')); }); });
        page.querySelectorAll('[data-saved-panel]').forEach(function (panel) { if (panel.querySelector('[data-compare-table]')) mark(panel, panel.querySelector('[data-compare-table]')); });

        // المفضلة: أي عنصر محفوظ على الجهاز واتبعت في اللينك (?ids=) والصفحة ما عرضتهوش (اتمسح / اتباع) بيتشال من المحفوظ ،
        // عشان عدد القلب في الهيدر يبقى زي اللي ظاهر في الصفحة — والصفحة الفاضية يبقى قلبها فاضي
        if (page.getAttribute('data-saved-page') === 'favorites') {
            try {
                var asked = (/[?&]ids=([^&#]*)/.exec(window.location.search) || ['', ''])[1];
                asked = asked ? decodeURIComponent(asked).split(',').filter(Boolean) : [];
                var rendered = Array.prototype.map.call(page.querySelectorAll('[data-saved-item]'), function (item) { return item.getAttribute('data-saved-item'); });
                var gone = asked.filter(function (id) { return rendered.indexOf(id) === -1; });
                if (gone.length) {
                    var kept = (JSON.parse(window.localStorage.getItem('shary-favorites')) || []).filter(function (id) { return gone.indexOf(id) === -1; });
                    window.localStorage.setItem('shary-favorites', JSON.stringify(kept));
                    if (window.SharyCards) window.SharyCards.refresh(document);
                }
            } catch (error) { /* التخزين مقفول */ }
        }

        // المفضلة: الكارت اللي اتشال قلبه بيختفي
        page.addEventListener('shary:favorite', function (event) {
            if (page.getAttribute('data-saved-page') !== 'favorites' || event.detail.active) return;
            var item = event.target.closest('[data-saved-item]');
            if (!item) return;
            var panel = item.closest('[data-saved-panel]');
            item.parentNode.removeChild(item);
            refresh(panel);
        });

        page.addEventListener('click', function (event) {
            if (!event.target.closest) return;

            // المفضلة: "قارن بين المحفوظ" — أول 4 من التبويب المفتوح بيتحطوا مكان المقارنة الحالية لنفس النوع، واللينك بياخدهم
            var send = event.target.closest('[data-saved-compare]');
            if (send && window.SharyCompare) {
                var open = page.querySelector('[data-saved-panel]:not(.hidden)');
                var group = open.getAttribute('data-saved-panel');
                var picked = Array.prototype.map.call(open.querySelectorAll('[data-saved-item]'), function (item) { return item.getAttribute('data-saved-item'); }).slice(0, 4);
                var list = window.SharyCompare.read().filter(function (id) { return id.indexOf(group + '/') !== 0; }).concat(picked);
                window.SharyCompare.write(list);
                var parts = [];
                ['units', 'projects'].forEach(function (name) {
                    var slugs = list.filter(function (id) { return id.indexOf(name + '/') === 0; }).map(function (id) { return id.slice(name.length + 1); });
                    if (slugs.length) parts.push(name + '=' + slugs.join(','));
                });
                parts.push('tab=' + group);
                var base = send.getAttribute('data-base') || send.getAttribute('href') || '';
                if (base && base !== '#') send.setAttribute('href', base + (base.indexOf('?') === -1 ? '?' : '&') + parts.join('&'));
                return;   // اللينك بيكمّل لصفحة المقارنة
            }

            // المقارنة: "الفروق فقط"
            var diff = event.target.closest('[data-compare-diff]');
            if (diff) {
                var diffPanel = diff.closest('[data-saved-panel]');
                var diffTable = diffPanel.querySelector('[data-compare-table]');
                var on = diff.getAttribute('aria-pressed') !== 'true';
                diff.setAttribute('aria-pressed', on ? 'true' : 'false');
                if (on) diffTable.setAttribute('data-diff-only', ''); else diffTable.removeAttribute('data-diff-only');
                mark(diffPanel, diffTable);
                return;
            }

            // المقارنة: X بيشيل عمود ، "مسح الكل" بيشيل كل أعمدة التبويب
            var button = event.target.closest('[data-compare-remove], [data-compare-clear]');
            if (!button) return;
            event.preventDefault();
            var panel = button.closest('[data-saved-panel]');
            var one = button.getAttribute('data-compare-remove');
            var removed = [];
            Array.prototype.forEach.call(panel.querySelectorAll('[data-col]'), function (cell) {
                var id = cell.getAttribute('data-col');
                if (one && id !== one) return;
                if (removed.indexOf(id) === -1) removed.push(id);
                cell.parentNode.removeChild(cell);
            });
            if (window.SharyCompare) window.SharyCompare.write(window.SharyCompare.read().filter(function (item) { return removed.indexOf(item) === -1; }));
            refresh(panel);
            removed.forEach(function (id) {
                panel.dispatchEvent(new CustomEvent('shary:compare', { bubbles: true, detail: { id: id, active: false } }));
            });
        });
    });
    // X اللي في هيدر صفحة المقارنة [data-compare-close] (بره لوحة المقارنة): بيقفل المقارنة كلها (وحدات ومشاريع) — الزرار العايم بيختفي من كل الصفحات —
    // وبيرجّع العميل للصفحة اللي كان فيها (أو data-back لو فتح المقارنة مباشرة). الحدث shary:compare-clear ({ ids }) عشان السيرفر يتحدّث.
    document.addEventListener('click', function (event) {
        var closeAll = event.target.closest ? event.target.closest('[data-compare-close]') : null;
        if (!closeAll) return;
        var ids = window.SharyCompare ? window.SharyCompare.read() : [];
        if (window.SharyCompare) window.SharyCompare.write([]);
        var go = closeAll.dispatchEvent(new CustomEvent('shary:compare-clear', { bubbles: true, cancelable: true, detail: { ids: ids } }));
        if (!go) return;   // اللي سمع الحدث هو اللي هينقل العميل
        if (window.history.length > 1 && document.referrer) window.history.back(); else window.location.href = closeAll.getAttribute('data-back') || '/';
    });
})();

/**
 * قايمة الاختيار اللي بالصور [data-select] — فورم بيع / تأجير العقار وفورم الوظائف (resources/views/requests/partials/field.blade.php) وفلتر العروض الحصرية (offers/index.blade.php)
 * - القايمة الأصلية <select> هي اللي بتتبعت مع الفورم. السكربت بيخفيها ويظهر مكانها زرار [data-select-toggle] وقايمة [data-select-list]
 *   فيها جنب كل اختيار صورته (أيقونة المنطقة / لوجو المشروع / أيقونة نوع العقار).
 * - القايمة بتفتح تحت الخانة دايمًا (مش لفوق)، ولو آخرها مش باين الصفحة بتنزل لها.
 * - اختيار واحد: الضغط بيختار ويقفل. اختيار متعدد (select multiple — مميزات الوحدة): الضغط بيعلّم / يشيل والقايمة بتفضل مفتوحة.
 * - أي تغيير بيطلع حدث change على الـ <select> — ولو كود تاني غيّر قيمته يطلّع change والزرار بيتحدّث لوحده.
 * من غير السكربت: القايمة الأصلية بتشتغل عادي.
 */
(function () {
    var opened = null;   // القايمة المفتوحة دلوقتي (واحدة بس)

    function closeOpened() {
        if (!opened) return;
        opened.list.classList.add('hidden');
        opened.toggle.setAttribute('aria-expanded', 'false');
        opened.box.classList.remove('is-open');
        var box = opened.box;
        opened = null;
        box.dispatchEvent(new CustomEvent('shary:select-close', { bubbles: true }));   // القايمة اتقفلت (فلتر العروض بيستناه)
    }

    document.querySelectorAll('[data-select]').forEach(function (box) {
        var select = box.querySelector('select');
        var native = box.querySelector('[data-select-native]');
        var toggle = box.querySelector('[data-select-toggle]');
        var list = box.querySelector('[data-select-list]');
        var label = box.querySelector('[data-select-label]');
        if (!select || !toggle || !list || !label) return;
        var items = Array.prototype.slice.call(list.querySelectorAll('[role="option"]'));
        var multi = select.multiple;
        var self = { box: box, list: list, toggle: toggle };

        native.classList.add('hidden');
        toggle.classList.remove('hidden');

        function option(value) {
            for (var i = 0; i < select.options.length; i++) if (select.options[i].value === value) return select.options[i];
            return null;
        }

        // الزرار والعلامات على حسب قيمة الـ select
        function sync() {
            var names = [];
            items.forEach(function (item) {
                var opt = option(item.getAttribute('data-value'));
                var on = !!opt && opt.selected && opt.value !== '';
                item.setAttribute('aria-selected', on ? 'true' : 'false');
                if (on) names.push(item.querySelector('[data-select-name]').textContent.trim());
            });
            var text = label.getAttribute('data-label');
            // اختيار واحد: اسمه. أكتر من واحد (مميزات الوحدة): أول اسم + عدد الباقي
            if (names.length) text = names[0] + (names.length > 1 ? ' +' + (names.length - 1) : '');
            label.textContent = text;
            label.classList.toggle('is-empty', names.length === 0);
            if (names.length) toggle.classList.remove('is-invalid');
        }

        function open() {
            closeOpened();
            list.classList.remove('hidden');
            toggle.setAttribute('aria-expanded', 'true');
            box.classList.add('is-open');
            opened = self;
            var current = list.querySelector('[aria-selected="true"]');
            if (current && !multi) list.scrollTop = Math.max(0, current.offsetTop - 60);
            // القايمة تحت الخانة: لو آخرها تحت الشاشة الصفحة بتنزل لها
            var rect = list.getBoundingClientRect();
            var space = (window.innerHeight || document.documentElement.clientHeight) - 96;
            if (rect.bottom > space) window.scrollBy({ top: Math.min(rect.bottom - space, toggle.getBoundingClientRect().top - 96), behavior: 'smooth' });
        }

        function choose(item) {
            var opt = option(item.getAttribute('data-value'));
            if (!opt) return;
            if (multi) opt.selected = !opt.selected;
            else select.value = opt.selected ? '' : opt.value;
            select.classList.toggle('has-value', !!select.value);
            select.dispatchEvent(new Event('change', { bubbles: true }));
            if (!multi) { closeOpened(); toggle.focus(); }
        }

        toggle.addEventListener('click', function () { if (opened === self) closeOpened(); else open(); });
        toggle.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowDown') { event.preventDefault(); if (opened !== self) open(); if (items[0]) items[0].focus(); }
        });
        list.addEventListener('click', function (event) {
            var item = event.target.closest ? event.target.closest('[role="option"]') : null;
            if (item) choose(item);
        });
        list.addEventListener('keydown', function (event) {
            var index = items.indexOf(document.activeElement);
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                var next = items[Math.max(0, Math.min(items.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)))];
                if (next) next.focus();
            } else if ((event.key === 'Enter' || event.key === ' ') && index > -1) {
                event.preventDefault();
                choose(items[index]);
            }
        });
        select.addEventListener('change', sync);
        if (select.form) select.form.addEventListener('reset', function () { setTimeout(sync, 0); });
        sync();
    });

    document.addEventListener('click', function (event) {
        if (opened && !opened.box.contains(event.target)) closeOpened();
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && opened) { var toggle = opened.toggle; closeOpened(); toggle.focus(); }
    });
})();

/**
 * فورم الخطوات [data-steps-form] — صفحة "بيع عقارك" وصفحة "أجّر عقارك" (resources/views/requests/property.blade.php)
 * - كل خطوة [data-step]: السكربت بيظهر خطوة واحدة، و"التالي" [data-steps-next] / "السابق" [data-steps-prev] بيبدّلوا بينهم.
 *   في آخر خطوة بيظهر زرار الإرسال [data-steps-submit] مكان "التالي".
 * - قبل "التالي" والإرسال: الخانات المطلوبة (required) في الخطوة الحالية لازم تتملى — الناقصة بتتعلّم (is-invalid) وبتظهر رسالة [data-steps-error].
 * - الدواير [data-step-dot]: data-state = done | current | todo.
 * - الصور [data-file-input]: المختار بيظهر مصغّر تحت الخانة وعلى كل واحدة X بتشيلها.
 * - الإرسال: بيطلع حدث shary:property-request على الفورم:
 *       form.addEventListener('shary:property-request', function (event) {
 *           event.preventDefault();                 // هنبعت AJAX
 *           // event.detail = { data: FormData, done(), fail(message) }
 *           fetch(form.action, { method: 'POST', body: event.detail.data }).then(event.detail.done, function () { event.detail.fail(); });
 *       });
 *   لو الحدث ما اتمنعش الفورم بيتبعت عادي (POST) والسيرفر يرجّع صفحة / رسالة النجاح. done() بتظهر [data-steps-done] مكان الفورم.
 * من غير السكربت: كل الخطوات ظاهرة تحت بعض وزرار الإرسال شغال.
 */
(function () {
    document.querySelectorAll('[data-steps-form]').forEach(function (form) {
        var steps = Array.prototype.slice.call(form.querySelectorAll('[data-step]'));
        if (!steps.length) return;
        var dots = Array.prototype.slice.call(form.querySelectorAll('[data-step-dot]'));
        var prev = form.querySelector('[data-steps-prev]');
        var next = form.querySelector('[data-steps-next]');
        var submit = form.querySelector('[data-steps-submit]');
        var error = form.querySelector('[data-steps-error]');
        var body = form.querySelector('[data-steps-body]');
        var done = form.querySelector('[data-steps-done]');
        var current = 0;

        function show(index, scroll) {
            current = Math.max(0, Math.min(steps.length - 1, index));
            steps.forEach(function (step, i) {
                step.classList.toggle('hidden', i !== current);
                step.classList.remove('mt-8');
            });
            dots.forEach(function (dot, i) { dot.setAttribute('data-state', i < current ? 'done' : i === current ? 'current' : 'todo'); });
            var last = current === steps.length - 1;
            prev.classList.toggle('hidden', current === 0);
            next.classList.toggle('hidden', last);
            submit.classList.toggle('hidden', !last);
            // أول خطوة: "التالي" بعرض الصف كله. الباقي: السابق + التالي / الإرسال
            next.classList.toggle('col-span-2', current === 0);
            submit.classList.toggle('col-span-2', current === 0);
            if (error) error.classList.add('hidden');
            if (scroll) {
                var top = form.getBoundingClientRect().top + window.pageYOffset - 96;
                if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: 'smooth' });
            }
        }

        // الخانات المطلوبة في الخطوة: الفاضية بتتعلّم
        function valid(step) {
            var ok = true;
            Array.prototype.forEach.call(step.querySelectorAll('[required]'), function (field) {
                var value = String(field.value || '').trim();
                var bad = !value || (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) || (field.type === 'tel' && value.replace(/\D/g, '').length < 6);
                // القايمة اللي بالصور (form-select.js): العلامة على الزرار الظاهر مش على القايمة الأصلية المخفية
                var custom = field.closest('[data-select]');
                var box = (custom && custom.querySelector('[data-select-toggle]:not(.hidden)')) || field.closest('.req-field') || field;
                box.classList.toggle('is-invalid', bad);
                if (bad && ok) field.focus();
                if (bad) ok = false;
            });
            // البريد اختياري، لكن لو اتكتب لازم يبقى صح
            Array.prototype.forEach.call(step.querySelectorAll('input[type="email"]:not([required])'), function (field) {
                var value = String(field.value || '').trim();
                var bad = !!value && !/^\S+@\S+\.\S+$/.test(value);
                field.closest('.req-field').classList.toggle('is-invalid', bad);
                if (bad) ok = false;
            });
            if (error) error.classList.toggle('hidden', ok);
            return ok;
        }

        form.addEventListener('input', function (event) {
            var box = event.target.closest ? event.target.closest('.req-field') : null;
            if (box) box.classList.remove('is-invalid');
            if (event.target.hasAttribute && event.target.hasAttribute('data-number')) event.target.value = event.target.value.replace(/[^\d.,]/g, '');   // خانات الأرقام: أرقام بس
        });
        form.addEventListener('change', function (event) {
            var box = event.target.closest ? event.target.closest('.req-field') : null;
            if (box) box.classList.remove('is-invalid');
            if (event.target.tagName === 'SELECT') event.target.classList.toggle('has-value', !!event.target.value);
        });

        next.addEventListener('click', function () { if (valid(steps[current])) show(current + 1, true); });
        prev.addEventListener('click', function () { show(current - 1, true); });

        // ---- الصور: مصغّرات تحت الخانة + X
        Array.prototype.forEach.call(form.querySelectorAll('[data-file-input]'), function (input) {
            var holder = input.closest('[data-field]');
            var label = holder.querySelector('[data-file-label]');
            var previews = holder.querySelector('[data-file-previews]');
            var files = [];
            function sync() {
                if (window.DataTransfer) {
                    try { var bag = new DataTransfer(); files.forEach(function (file) { bag.items.add(file); }); input.files = bag.files; } catch (e) { /* متصفح قديم: الملفات زي ما اختارها */ }
                }
                label.textContent = files.length ? files.length + ' ' + label.getAttribute('data-count') : label.getAttribute('data-label');
                label.classList.toggle('text-shary-navy', files.length > 0);
                if (files.length) input.closest('.req-field').classList.remove('is-invalid');
                previews.textContent = '';
                previews.classList.toggle('hidden', files.length === 0);
                previews.classList.toggle('flex', files.length > 0);
                files.forEach(function (file, index) {
                    var item = document.createElement('div');
                    item.className = 'req-thumb';
                    if (/^image\//.test(file.type) && window.URL) {
                        var img = document.createElement('img');
                        img.src = URL.createObjectURL(file);
                        img.alt = file.name;
                        item.appendChild(img);
                    } else if (/^video\//.test(file.type) && window.URL) {
                        // فيديو: أول لقطة منه + علامة تشغيل
                        var clip = document.createElement('video');
                        clip.src = URL.createObjectURL(file) + '#t=0.1';
                        clip.muted = true; clip.preload = 'metadata'; clip.setAttribute('playsinline', '');
                        item.classList.add('req-thumb--video');
                        item.appendChild(clip);
                    } else {
                        var name = document.createElement('span');
                        name.textContent = file.name;
                        item.appendChild(name);
                    }
                    var remove = document.createElement('button');
                    remove.type = 'button';
                    remove.setAttribute('aria-label', previews.getAttribute('data-remove-label') || 'Remove');
                    remove.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
                    remove.addEventListener('click', function () { files.splice(index, 1); sync(); });
                    item.appendChild(remove);
                    previews.appendChild(item);
                });
            }
            input.addEventListener('change', function () {
                files = files.concat(Array.prototype.slice.call(input.files || []));
                sync();
            });
            form.addEventListener('reset', function () { files = []; setTimeout(sync, 0); });
        });

        function finish() {
            if (body) body.classList.add('hidden');
            if (done) { done.classList.remove('hidden'); done.classList.add('flex'); }
            var top = form.getBoundingClientRect().top + window.pageYOffset - 96;
            window.scrollTo({ top: top, behavior: 'smooth' });
        }

        form.addEventListener('submit', function (event) {
            // لازم كل الخطوات تبقى سليمة (لو العميل رجع لخطوة قديمة وفضّى خانة)
            for (var i = 0; i < steps.length; i++) {
                if (!valid(steps[i])) { event.preventDefault(); show(i, true); valid(steps[i]); return; }
            }
            var go = form.dispatchEvent(new CustomEvent('shary:property-request', {
                bubbles: true,
                cancelable: true,
                detail: { data: new FormData(form), done: finish, fail: function (message) { if (error) { if (message) error.textContent = message; error.classList.remove('hidden'); } } }
            }));
            if (!go) event.preventDefault();   // الإرسال هيتم من اللي سمع الحدث (AJAX) وينادي done()
        });

        var again = form.querySelector('[data-steps-again]');
        if (again) again.addEventListener('click', function () {
            form.reset();
            Array.prototype.forEach.call(form.querySelectorAll('select'), function (select) { select.classList.remove('has-value'); });
            if (done) { done.classList.add('hidden'); done.classList.remove('flex'); }
            if (body) body.classList.remove('hidden');
            show(0, true);
        });

        show(0, false);
    });
})();

/**
 * صفحة العروض الحصرية (resources/views/offers/index.blade.php)
 * الفلتر [data-offers-filter] فورم GET: المنطقة / المطور / العرض — التلاتة اختيار متعدد (area[] / developer[] / offer[]). القوايم نفسها من js/shary/form-select.js.
 * - تغيير أي اختيار بيطلع حدث shary:offers-filter على الفورم، وزرار "تطبيق" بيختفي:
 *       form.addEventListener('shary:offers-filter', function (event) {
 *           event.preventDefault();          // هنجيب النتايج AJAX ونبدّل الكروت بنفسنا
 *           // event.detail = { area: ['new-cairo'], developer: ['lavista'], offer: ['dp-5', 'cash'] }
 *       });
 *   لو الحدث ما اتمنعش الفورم بيتبعت عادي والصفحة بترجع متفلترة من السيرفر (العرض المتعدد بيتبعت لما قايمته تتقفل عشان العميل يختار أكتر من عرض).
 * - زرار "مسح" [data-offers-reset]: بيرجّع الفلاتر التلاتة للكل (نفس الحدث بقيم فاضية) — ولو الحدث ما اتمنعش بيفتح لينك الصفحة من غير فلتر.
 */
(function () {
    document.querySelectorAll('[data-offers-filter]').forEach(function (form) {
        var apply = form.querySelector('[data-offers-apply]');
        var reset = form.querySelector('[data-offers-reset]');
        var selects = Array.prototype.slice.call(form.querySelectorAll('select'));
        var silent = false, pending = false;
        if (apply) apply.classList.add('hidden');
        form.classList.add('is-live');

        function values() {
            var detail = {};
            selects.forEach(function (select) {
                var name = select.name.replace(/\[\]$/, '');
                detail[name] = select.multiple ? Array.prototype.filter.call(select.options, function (o) { return o.selected && o.value; }).map(function (o) { return o.value; }) : select.value;
            });
            return detail;
        }

        function mark(detail) {
            var active = Object.keys(detail).some(function (key) { return detail[key] && detail[key].length; });
            if (reset) reset.classList.toggle('is-active', active);
        }

        function send(event) {
            if (silent) return;
            if (event && event.type === 'submit') event.preventDefault();
            var detail = values();
            mark(detail);
            var go = form.dispatchEvent(new CustomEvent('shary:offers-filter', { bubbles: true, cancelable: true, detail: detail }));
            if (!go) return;
            // من غير AJAX: الاختيار المتعدد بيتبعت لما القايمة تتقفل
            if (event && event.target && event.target.multiple && form.querySelector('[data-select].is-open')) { pending = true; return; }
            form.submit();
        }

        form.addEventListener('change', send);
        form.addEventListener('submit', send);
        form.addEventListener('shary:select-close', function () { if (pending) { pending = false; form.submit(); } });

        if (reset) reset.addEventListener('click', function (event) {
            silent = true;
            selects.forEach(function (select) {
                if (select.multiple) Array.prototype.forEach.call(select.options, function (o) { o.selected = false; }); else select.value = '';
                select.dispatchEvent(new Event('change', { bubbles: true }));   // زرار القايمة بيتحدّث
            });
            silent = false;
            var detail = values();
            mark(detail);
            var go = form.dispatchEvent(new CustomEvent('shary:offers-filter', { bubbles: true, cancelable: true, detail: detail }));
            if (!go) event.preventDefault();   // AJAX: من غير تحميل. غير كده اللينك بيفتح الصفحة من غير فلتر
        });
    });
})();

/**
 * صفحة "الأكثر رواجًا" — الفيديوهات (resources/views/trends/index.blade.php)
 * كارت الفيديو [data-video-open] عليه data-video = لينك التضمين (يوتيوب embed / فيميو) أو لينك ملف mp4، و data-video-title = العنوان.
 * الضغط بيفتح نافذة الفيديو [data-video-modal] والفيديو بيشتغل، والقفل (X / الضغط بره / Esc / زرار الرجوع) بيوقفه.
 * لو data-video فاضي بتظهر رسالة [data-empty] مكان الفيديو.
 */
(function () {
    if (!document.querySelector('[data-video-modal]')) return;
    var modal = null, frame = null, heading = null;
    var opened = false;

    // النافذة الأقرب للكارت (لو الصفحة فيها أكتر من نافذة) وإلا أول نافذة في الصفحة
    function pick(button) {
        var scope = button.closest('main') || document;
        modal = scope.querySelector('[data-video-modal]') || document.querySelector('[data-video-modal]');
        frame = modal.querySelector('[data-video-frame]');
        heading = modal.querySelector('[data-video-heading]');
    }

    function close(fromBack) {
        if (!opened) return;
        opened = false;
        modal.classList.add('hidden');
        frame.textContent = '';   // بيوقف الفيديو
        document.documentElement.classList.remove('overflow-hidden');
        if (!fromBack && window.SharyBack && window.SharyBack.closed) window.SharyBack.closed();
    }

    function open(button) {
        if (opened) close(false);
        pick(button);
        var url = button.getAttribute('data-video') || '';
        heading.textContent = button.getAttribute('data-video-title') || '';
        frame.textContent = '';
        if (!url) {
            var note = document.createElement('p');
            note.textContent = frame.getAttribute('data-empty') || '';
            frame.appendChild(note);
        } else if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
            var video = document.createElement('video');
            video.src = url; video.controls = true; video.autoplay = true; video.setAttribute('playsinline', '');
            frame.appendChild(video);
        } else {
            var iframe = document.createElement('iframe');
            iframe.src = url + (url.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1';
            iframe.title = heading.textContent;
            iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen');
            iframe.setAttribute('allowfullscreen', '');
            frame.appendChild(iframe);
        }
        modal.classList.remove('hidden');
        document.documentElement.classList.add('overflow-hidden');
        opened = true;
        if (window.SharyBack && window.SharyBack.opened) window.SharyBack.opened(function () { close(true); });
    }

    document.addEventListener('click', function (event) {
        if (!event.target.closest) return;
        var button = event.target.closest('[data-video-open]');
        if (button) { event.preventDefault(); open(button); return; }
        if (event.target.closest('[data-video-close]')) close(false);
    });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') close(false); });
})();

/**
 * صفحة شاري كارد (resources/views/card/show.blade.php)
 * - شريط الكود [data-card-strip]: العميل اللي معاه كارت بيشوف رقم الكود [data-card-code] على الكارت (is-revealed) وتحت الكارت [data-card-code-text].
 *   الضغط على الشريط بيغطي / يكشف الكود. الزائر: الشريط رمادي والضغط عليه بينزّله للفورم.
 * - زرار النسخ [data-card-copy]: بينسخ الكود وبيكتب "تم نسخ الكود" لحظة.
 * - فورم طلب الكارت [data-card-form]: بيتأكد من الاسم والرقم، وبعدها بيطلع حدث shary:card-request على الفورم:
 *       form.addEventListener('shary:card-request', function (event) {
 *           event.preventDefault();                         // هنطلب الكارت AJAX
 *           // event.detail = { name, phone, country_code, show(card), pending(), fail(message) }
 *           event.detail.pending();                                           // الطلب اتسجل والكود لسه هيصدر من الأدمن: رسالة "طلبك وصل"
 *           event.detail.show({ name: 'نبيل سليمان', code: 'SH-482913' });   // الكود صدر: الكارت بيظهر باسمه وكوده + دعوة صديق
 *       });
 *   لو الحدث ما اتمنعش الفورم بيتبعت عادي (POST) والسيرفر يرجّع الصفحة بالكارت ($card).
 */
(function () {
    document.querySelectorAll('[data-card-page]').forEach(function (page) {
        var strip = page.querySelector('[data-card-strip]');
        var code = page.querySelector('[data-card-code]');
        var name = page.querySelector('[data-card-name]');
        var form = page.querySelector('[data-card-form]');
        var ready = page.querySelector('[data-card-ready]');
        var copyButton = page.querySelector('[data-card-copy]');

        var codeText = page.querySelector('[data-card-code-text]');

        if (strip) strip.addEventListener('click', function () {
            if (!code.textContent.trim()) {
                // زائر لسه ما أخدش كارت: ينزل لفورم الطلب
                var first = form && form.querySelector('input[name="name"]');
                if (first) { form.scrollIntoView({ behavior: 'smooth', block: 'center' }); first.focus({ preventScroll: true }); }
                return;
            }
            strip.classList.toggle('is-revealed');
        });

        if (copyButton) copyButton.addEventListener('click', function () {
            var value = code.textContent.trim();
            if (!value) return;
            var label = copyButton.querySelector('[data-card-copy-label]');
            var original = label.textContent;
            function done() { label.textContent = copyButton.getAttribute('data-done') || original; setTimeout(function () { label.textContent = original; }, 1800); }
            if (strip) strip.classList.add('is-revealed');
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(value).then(done, done); else done();
        });

        var pendingBox = page.querySelector('[data-card-pending]');
        var invite = page.querySelector('[data-card-invite]');

        // الطلب اتسجل ولسه الكود ما صدرش من الأدمن: رسالة "طلبك وصل" مكان الفورم
        function pending() {
            if (form) form.classList.add('hidden');
            if (pendingBox) pendingBox.classList.remove('hidden');
        }

        // الكارت بيظهر باسم العميل وكوده
        function show(card) {
            if (!card || !card.code) return;
            if (pendingBox) pendingBox.classList.add('hidden');
            if (invite) invite.href = 'https://wa.me/?text=' + encodeURIComponent((invite.getAttribute('data-message') || '').replace(':code', card.code));
            name.textContent = card.name || name.getAttribute('data-empty');
            code.textContent = card.code;
            if (codeText) codeText.textContent = card.code;
            strip.classList.add('is-revealed');
            page.setAttribute('data-state', 'member');
            if (form) form.classList.add('hidden');
            if (ready) ready.classList.remove('hidden');
            var top = page.getBoundingClientRect().top + window.pageYOffset - 90;
            if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: 'smooth' });
        }

        if (!form) return;
        var error = form.querySelector('[data-card-error]');
        form.addEventListener('input', function () { if (error) error.classList.add('hidden'); });
        form.addEventListener('submit', function (event) {
            var nameInput = form.querySelector('input[name="name"]');
            var phoneInput = form.querySelector('input[name="phone"]');
            var ok = nameInput.value.trim().length > 1 && phoneInput.value.replace(/\D/g, '').length >= 6;
            if (!ok) {
                event.preventDefault();
                if (error) error.classList.remove('hidden');
                (nameInput.value.trim().length > 1 ? phoneInput : nameInput).focus();
                return;
            }
            var go = form.dispatchEvent(new CustomEvent('shary:card-request', {
                bubbles: true,
                cancelable: true,
                detail: {
                    name: nameInput.value.trim(), phone: phoneInput.value, country_code: (form.querySelector('[data-phone-value]') || {}).value || '',
                    show: show,
                    pending: pending,
                    fail: function (message) { if (error) { if (message) error.textContent = message; error.classList.remove('hidden'); } }
                }
            }));
            if (!go) event.preventDefault();
        });
    });
})();

/**
 * صفحة الوظائف (resources/views/careers/index.blade.php)
 * - "قدّم الآن" [data-job-apply="slug"]: بيختار الوظيفة في فورم التقديم وينزل للفورم.
 * - السيرة الذاتية [data-cv-input]: زرارين [data-cv-pick] — "ملف" بيفتح المستندات (PDF / Word) و"صورة" بيفتح معرض الصور — واسم الملف بيظهر مكان اسم الخانة.
 * - الإرسال: بيتأكد من الاسم والرقم والسيرة الذاتية، وبعدها حدث shary:career-apply على الفورم:
 *       form.addEventListener('shary:career-apply', function (event) {
 *           event.preventDefault();                 // هنبعت AJAX
 *           // event.detail = { data: FormData, done(), fail(message) }
 *       });
 *   لو الحدث ما اتمنعش الفورم بيتبعت عادي (POST multipart).
 */
(function () {
    document.querySelectorAll('[data-career-form]').forEach(function (form) {
        var select = form.querySelector('select[name="position"]');
        var input = form.querySelector('[data-cv-input]');
        var label = form.querySelector('[data-cv-label]');
        var error = form.querySelector('[data-career-error]');
        var body = form.querySelector('[data-career-body]');
        var done = form.querySelector('[data-career-done]');

        function mark() { if (select) select.classList.toggle('has-value', !!select.value); }

        document.addEventListener('click', function (event) {
            var button = event.target.closest ? event.target.closest('[data-job-apply]') : null;
            if (!button) return;
            if (select) { select.value = button.getAttribute('data-job-apply'); mark(); select.dispatchEvent(new Event('change', { bubbles: true })); }   // change: زرار القايمة (form-select.js) بيتحدّث
            var top = form.getBoundingClientRect().top + window.pageYOffset - 96;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });

        if (select) select.addEventListener('change', mark);
        // "ملف" / "صورة": نفس الخانة بنوع مختلف (accept) عشان الموبايل يفتح المستندات أو معرض الصور
        form.querySelectorAll('[data-cv-pick]').forEach(function (button) {
            button.addEventListener('click', function () {
                if (!input) return;
                input.setAttribute('accept', button.getAttribute('data-accept'));
                input.click();
            });
        });
        if (label && input) label.addEventListener('click', function () { input.click(); });
        if (input) input.addEventListener('change', function () {
            var file = input.files && input.files[0];
            label.textContent = file ? file.name : label.getAttribute('data-label');
            label.classList.toggle('text-shary-navy', !!file);
            input.closest('.req-field').classList.remove('is-invalid');
        });
        form.addEventListener('input', function (event) {
            var box = event.target.closest ? event.target.closest('.req-field') : null;
            if (box) box.classList.remove('is-invalid');
            if (error) error.classList.add('hidden');
        });

        form.addEventListener('submit', function (event) {
            var name = form.querySelector('input[name="name"]');
            var phone = form.querySelector('input[name="phone"]');
            var bad = [];
            if (name.value.trim().length < 2) bad.push(name);
            if (phone.value.replace(/\D/g, '').length < 6) bad.push(phone);
            if (input && !(input.files && input.files.length)) bad.push(input);
            [name, phone, input].forEach(function (field) { if (field) field.closest('.req-field').classList.toggle('is-invalid', bad.indexOf(field) !== -1); });
            if (bad.length) {
                event.preventDefault();
                if (error) error.classList.remove('hidden');
                return;
            }
            var go = form.dispatchEvent(new CustomEvent('shary:career-apply', {
                bubbles: true,
                cancelable: true,
                detail: {
                    data: new FormData(form),
                    done: function () { body.classList.add('hidden'); done.classList.remove('hidden'); done.classList.add('flex'); },
                    fail: function (message) { if (error) { if (message) error.textContent = message; error.classList.remove('hidden'); } }
                }
            }));
            if (!go) event.preventDefault();
        });

        var again = form.querySelector('[data-career-again]');
        if (again) again.addEventListener('click', function () {
            form.reset();
            mark();
            if (label) { label.textContent = label.getAttribute('data-label'); label.classList.remove('text-shary-navy'); }
            done.classList.add('hidden'); done.classList.remove('flex');
            body.classList.remove('hidden');
        });
    });
})();

/**
 * صفحة الإشعارات (resources/views/notifications/index.blade.php)
 * - التبويب [data-notify-tab="all | unread"] بيفلتر القايمة من غير تحميل.
 * - الضغط على إشعار غير مقروء بيعلّمه مقروء وبيطلع حدث shary:notification-read ({ id }) — اسمعوه عشان تحدّثوا السيرفر. اللينك بيفتح عادي.
 * - "تعليم الكل كمقروء" [data-notify-all]: حدث shary:notifications-read-all.
 * - زرار التفعيل [data-notify-button]: حدث shary:notifications-enable ({ done() }) — اربطوه بتفعيل إشعارات المتصفح / التطبيق ونادوا done().
 *   لو الحدث ما اتمنعش السكربت بيطلب إذن إشعارات المتصفح (Notification.requestPermission) لو متاح.
 */
(function () {
    document.querySelectorAll('[data-notifications]').forEach(function (box) {
        var list = box.querySelector('[data-notify-list]');
        var empty = box.querySelector('[data-notify-empty]');
        var all = box.querySelector('[data-notify-all]');
        var mode = 'all';

        function items() { return Array.prototype.slice.call(list.querySelectorAll('[data-notify-item]')); }

        function refresh() {
            var unread = items().filter(function (item) { return item.getAttribute('data-read') !== '1'; });
            var shown = 0;
            items().forEach(function (item) {
                var show = mode === 'all' || item.getAttribute('data-read') !== '1';
                item.classList.toggle('hidden', !show);
                if (show) shown++;
            });
            box.querySelectorAll('[data-notify-count="all"]').forEach(function (n) { n.textContent = items().length; });
            box.querySelectorAll('[data-notify-count="unread"]').forEach(function (n) { n.textContent = unread.length; });
            if (empty) empty.classList.toggle('hidden', shown > 0);
            if (all) all.classList.toggle('hidden', unread.length === 0);
        }

        box.querySelectorAll('[data-notify-tab]').forEach(function (tab) {
            tab.addEventListener('click', function () {
                mode = tab.getAttribute('data-notify-tab');
                box.querySelectorAll('[data-notify-tab]').forEach(function (other) { other.setAttribute('aria-selected', other === tab ? 'true' : 'false'); });
                refresh();
            });
        });

        list.addEventListener('click', function (event) {
            var item = event.target.closest ? event.target.closest('[data-notify-item]') : null;
            if (!item || item.getAttribute('data-read') === '1') return;
            item.setAttribute('data-read', '1');
            item.dispatchEvent(new CustomEvent('shary:notification-read', { bubbles: true, detail: { id: item.getAttribute('data-notify-item') } }));
            refresh();
        });

        if (all) all.addEventListener('click', function () {
            items().forEach(function (item) { item.setAttribute('data-read', '1'); });
            all.dispatchEvent(new CustomEvent('shary:notifications-read-all', { bubbles: true }));
            refresh();
        });

        var button = box.querySelector('[data-notify-button]');
        var title = box.querySelector('[data-notify-title]');
        function enabled() {
            if (title) title.textContent = title.getAttribute('data-on') || title.textContent;
            if (button) button.classList.add('hidden');
        }
        if (window.Notification && Notification.permission === 'granted') enabled();
        if (button) button.addEventListener('click', function () {
            var go = button.dispatchEvent(new CustomEvent('shary:notifications-enable', { bubbles: true, cancelable: true, detail: { done: enabled } }));
            if (!go) return;
            if (window.Notification && Notification.requestPermission) {
                try { Notification.requestPermission().then(function (result) { if (result === 'granted') enabled(); }); } catch (error) { enabled(); }
            } else {
                enabled();
            }
        });

        refresh();
    });
})();

/**
 * صفحة الدولة في "عقارات دولية" (abroad/country.blade.php):
 * اختيار منطقة [data-abroad-area="slug"] (كارت المنطقة أو الشريط فوق "كل المشاريع" — "" = كل المناطق) بيعرض مشاريع المنطقة دي بس
 * [data-abroad-project][data-area] من غير تحميل: العنوان [data-abroad-title] ، النبذة [data-abroad-area-text] ، العدد [data-abroad-count] ،
 * واللينك في المتصفح بيبقى /properties-abroad/{country}/{area}. من غير السكربت اللينك نفسه بيفتح الصفحة متفلترة من السيرفر.
 * من أي كود: window.SharyAbroad.area('dubai-marina')
 */
(function () {
    var pages = document.querySelectorAll('[data-abroad-page][data-country]');
    var api = { area: function () {} };

    pages.forEach(function (page) {
        var projects = Array.prototype.slice.call(page.querySelectorAll('[data-abroad-project]'));
        var picks = Array.prototype.slice.call(page.querySelectorAll('[data-abroad-area]'));
        var title = page.querySelector('[data-abroad-title]');
        var text = page.querySelector('[data-abroad-area-text]');
        var count = page.querySelector('[data-abroad-count]');
        var empty = page.querySelector('[data-abroad-empty]');
        var section = (title && title.closest('section')) || page;
        if (!projects.length) return;

        function choose(area, scroll) {
            var shown = 0, pick = null;
            projects.forEach(function (card) {
                var on = !area || card.getAttribute('data-area') === area;
                card.classList.toggle('hidden', !on);
                if (on) shown++;
            });
            picks.forEach(function (item) {
                var on = item.getAttribute('data-abroad-area') === area;
                item.setAttribute('aria-pressed', on ? 'true' : 'false');
                if (on && item.getAttribute('data-name')) pick = item;
            });
            if (title) title.textContent = pick ? page.getAttribute('data-title-area').replace(':name', pick.getAttribute('data-name')) : page.getAttribute('data-title-all');
            if (text) { text.textContent = pick ? pick.getAttribute('data-text') || '' : ''; text.classList.toggle('hidden', !pick || !text.textContent); }
            if (count) count.textContent = shown;
            if (empty) empty.classList.toggle('hidden', shown > 0);
            page.setAttribute('data-area', area);
            if (scroll) window.setTimeout(function () { section.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
        }

        picks.forEach(function (item) {
            item.addEventListener('click', function (event) {
                event.preventDefault();
                var area = item.getAttribute('data-abroad-area') || '';
                choose(area, true);
                // لينك نضيف في المتصفح (السيو والمشاركة) — المعاينة / الملفات المحلية من غير تغيير اللينك
                if (window.history && window.history.replaceState && /^https?:/.test(window.location.protocol) && !document.querySelector('[data-view]')) {
                    try { window.history.replaceState(null, '', item.getAttribute('href').replace(/#.*$/, '')); } catch (error) { /* اللينك زي ما هو */ }
                }
            });
        });
        api.area = function (area) { choose(area || '', true); };
    });

    window.SharyAbroad = api;
})();

