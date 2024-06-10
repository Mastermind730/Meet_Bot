import puppeteer from 'puppeteer';

interface BotParams {
    meetLink: string;
    email: string;
    password: string;
}

async function delay(time: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, time));
}

export async function startBot(params: BotParams): Promise<void> {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://accounts.google.com/signin');
    await page.type('input[type="email"]', params.email);
    await page.click('#identifierNext');
    await delay(3000);
    await page.type('input[type="password"]', params.password);
    await page.click('#passwordNext');
    await delay(3000);

    await page.goto(params.meetLink);
    await page.waitForSelector('button[aria-label="Join now"]');
    await page.click('button[aria-label="Join now"]');

    // Expose a function to the browser context to handle mute detection and audio recording
    await page.exposeFunction('onMuteDetected', async () => {
        // Evaluate the function within the browser context
        await page.evaluate(async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const audioChunks: BlobPart[] = [];
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            mediaRecorder.start();

            // Simulate mute detection and recording for 10 seconds
            await new Promise((resolve) => setTimeout(resolve, 10000));
            mediaRecorder.stop();

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks);
                const audioBuffer = await audioBlob.arrayBuffer();

                const response = await fetch('https://your-remote-server.com/process', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/octet-stream',
                    },
                    body: audioBuffer,
                });

                const responseAudioBuffer = await response.arrayBuffer();
                const responseBlob = new Blob([responseAudioBuffer]);
                const responseAudioUrl = URL.createObjectURL(responseBlob);

                const audio = new Audio(responseAudioUrl);
                audio.play();

                // Unmute the bot after playing the response
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'u' })); // Assuming 'u' is the unmute shortcut
            };
        });
    });

    // Simulate mute detection by calling the function directly
    await page.evaluate(() => {
        (window as any).onMuteDetected();
    });

    // Close the browser when done
    await browser.close();
}
