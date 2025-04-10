const { App } = require("@slack/bolt")
const fs = require("fs").promises

// Initialize your app with Socket Mode enabled
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true, // Enable Socket Mode
  appToken: process.env.SLACK_APP_TOKEN, // Add App-level token
})

// File to store user state
const STATE_FILE = ".data/user_state.json"

// Load user state from file
const loadUserState = async () => {
  try {
    // Create .data directory if it doesn't exist
    try {
      await fs.mkdir(".data", { recursive: true })
    } catch (error) {
      // Directory already exists or cannot be created
      console.error("Error creating directory:", error)
    }

    const data = await fs.readFile(STATE_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist or has invalid JSON, return empty object
    return {}
  }
}

// Save user state to file
const saveUserState = async (state) => {
  // Create .data directory if it doesn't exist
  try {
    await fs.mkdir(".data", { recursive: true })
  } catch (error) {
    // Directory already exists or cannot be created
    console.error("Error creating directory:", error)
  }

  // Write state to file
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf8")
}

// Define onboarding steps
const onboardingSteps = [
  {
    step: 1,
    message: {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Welcome to Abide! Let's be real, you're here for the coffee right? Good, cause there will definetly be coffee. ☕️",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*What is Abide?*",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Abide is a space to slow down, be present with the Lord, and encourage one another in love. In a world that often feels fast and disconnected, my hope is that this group would feel like a breath of fresh air—somewhere we can show up as we are and find rest, support, and friendship. Each gathering will stand on its own, so there's no pressure to keep up or be at every one. Whether you come regularly or jump in when you’re able, you’ll always be welcomed right where you left off. I’d also love for each of us to feel free to share what God’s putting on our hearts—whether that’s a verse, a prayer, a testimony, or something creative. You’re never required to lead, but I believe the Lord can use each of us to bless one another in really meaningful ways. Let’s create a space where we can abide in Him—and with each other.",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Now let's get you set up with this app.",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Let's Go!",
                emoji: true,
              },
              style: "primary",
              value: "step_1_complete",
              action_id: "onboarding_next_step",
            },
          ],
        },
      ],
    },
  },
  {
    step: 2,
    message: {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Let's get you set up with a few quick steps.",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Step 1:* Download the Slack app for your phone. This will help you stay connected with the group and stay up to date on any announcements.",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "I've downloaded the app",
                emoji: true,
              },
              style: "primary",
              value: "step_2_complete",
              action_id: "onboarding_next_step",
            },
          ],
        },
      ],
    },
  },
  {
    step: 3,
    message: {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Step 2:* Complete your profile by adding a photo. It's easy to forget names, so a photo will help others remember who you are.",
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "👉 *How to add a profile photo:*\n    • Tap 'more'\n    • Tap your avatar (top right)\n    • Select 'View profile'\n    • Select 'Edit profile'\n    • Select 'Edit Photo'\n",
            },
          ],
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "I've added my photo",
                emoji: true,
              },
              style: "primary",
              value: "step_3_complete",
              action_id: "onboarding_next_step",
            },
          ],
        },
      ],
    },
  },
  {
    step: 4,
    message: {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Step 6:* See all the scheduled meet-up dates by adding the Abide Calendar.",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Click the button below to add the calendar directly to your Google Calendar:",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Add to Google Calendar",
                emoji: true,
              },
              url: "https://calendar.google.com/calendar/u/0?cid=YmE1Mjk3ZmFkNGNmY2E2ZmZlNjUzNjQ2MjBkYTczYWIxMzBiMGQ3N2RmOTVjZTY5NWE5YmEwZTgzZWQ4NTNjZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
              action_id: "calendar_link_clicked",
            },
          ],
        },

        {
          type: "divider",
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "*Don't use Google Calendar?* No problem! A reminder will be sent in #the-group channel the day before each meeting.",
            },
          ],
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "I've added the calendar",
                emoji: true,
              },
              style: "primary",
              value: "step_4_complete",
              action_id: "onboarding_calendar_added",
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Skip this step",
                emoji: true,
              },
              value: "step_4_skip",
              action_id: "onboarding_calendar_skip",
            },
          ],
        },
      ],
    },
  },
  {
    step: 5,
    message: {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Step 3:* Understanding Channels.",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Channels are like a group text. Here you will be able to send and receive messages to the whole group. The great news is you don't have to be notified everytime you get a new message. We'll set this up soon.",
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "👉 *Tap on Home*\n    (_To get back here: under the 'Apps' section_\n    _tap 'Abide Bot'_)",
            },
            {
              type: "mrkdwn",
              text: "👉 *You should see two channels:*",
            },
            {
              type: "mrkdwn",
              text: "• #*prayer-requests*\n  _A place to share and read prayer requests_\n  _with the whole group_",
            },
            {
              type: "mrkdwn",
              text: "• #*the-group*\n  _Our general message thread._\n  _This channel is for:_\n    • Chatting\n    • Meeting reminders\n    • Meeting notes\n    • Etc.",
            },
          ],
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Got it 👍",
                emoji: true,
              },
              style: "primary",
              value: "step_5_complete",
              action_id: "onboarding_next_step",
            },
          ],
        },
      ],
    },
  },
  {
    step: 6,
    message: {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Step 4:* Direct Messages",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "If you want to talk directly to somone in our group you can send direct messages!",
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "💡 Feel free to messsage @Val if you need help with anything.",
            },
          ],
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Are we done yet?",
                emoji: true,
              },
              style: "primary",
              value: "step_6_complete",
              action_id: "onboarding_next_step",
            },
          ],
        },
      ],
    },
  },
  {
    step: 7,
    message: {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Almost 😅",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Step 5:* Setting up notifications",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "I don't know about you, but if I'm in a group text I'm muting it, but then I miss important announcements. Here you can customize when you want to receive notifications. Begin by making sure notifiactions for Slack are turned on in your phone's settings. Now you can set up when you want to receive notifications _for each channel_.",
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "👉 *Let's start with #the-group*\n    • Tap Home\n    • Tap #the-group\n    • Tap the ⌄ at the top\n    • Tap ⛭ Settings & Details\n    • Tap Notifications\n    • Select Only @mentions",
            },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "This means for #the-group channel you will only get a push notification when someone @'s you or Val sends a message with @channel (such as cancelations and meet-up reminders). You can change the notification settings for any channel, such as the #prayer-requests channel, but be sure to regularly check the channel for prayer requests if you set it to just mentions!",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Phew! Thanks!",
                emoji: true,
              },
              style: "primary",
              value: "step_7_complete",
              action_id: "onboarding_next_step",
            },
          ],
        },
      ],
    },
  },
  {
    step: 8,
    message: {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Step 7:* Inviting Others",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "The purpose of Abide is for all of us to grow in our relationship with Christ and nurture our existing friendships, so please invite _your_ friends 💕\n_Here's how to invite others to Abide Slack:_ ",
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "👉 *On iOS:*\n• From the Home tab, swipe right\n• Tap the three dots icon next to Abide\n• Tap 'Invite Members'\n• 'Share a link' to send an invite link, Enter email addresses, or Add from your contacts",
            },
            {
              type: "mrkdwn",
              text: "👉 *On Android:*\n• From the DMs tab, tap the plus sign (+)\n• Tap 'Invite'\n• Enter email addresses or tap 'Contacts' to invite people saved on your device",
            },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Finally, have her come directly to this bot and send the 'hi' message so she can get set up!",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Yay!",
                emoji: true,
              },
              style: "primary",
              value: "step_8_complete",
              action_id: "onboarding_next_step",
            },
          ],
        },
      ],
    },
  },
  {
    step: 9,
    message: {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "🎊 *That's All!* 🎊",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Feel free to message me any time you have questions about using this space 🥰.",
          },
        },
      ],
    },
  },
]

// Function to start the onboarding process
const startOnboarding = async (client, userId) => {
  try {
    // Load current state
    const userState = await loadUserState()

    // Set initial state
    userState[userId] = 1

    // Save updated state
    await saveUserState(userState)

    // Send first step
    await client.chat.postMessage({
      channel: userId,
      text: "Welcome to Abide Slack! Let's get you set up.",
      ...onboardingSteps[0].message,
    })

    console.log(`Started onboarding for user ${userId}`)
  } catch (error) {
    console.error(`Error starting onboarding: ${error}`)
  }
}

// Function to advance to the next step
async function goToNextStep(client, userId) {
  try {
    // Load current state
    const userState = await loadUserState()
    console.log(`Current state for user ${userId}:`, userState)

    // Get current step and increment
    // Make sure we're getting a NUMBER, not an object
    let currentStep = 1
    if (userState[userId]) {
      if (typeof userState[userId] === "number") {
        currentStep = userState[userId]
      } else if (userState[userId].step) {
        currentStep = userState[userId].step
      }
    }

    const nextStep = currentStep + 1
    console.log(`Moving user ${userId} from step ${currentStep} to ${nextStep}`)

    // Update user state as a simple number
    userState[userId] = nextStep

    // Save updated state
    await saveUserState(userState)

    // If there are more steps, send the next one
    if (nextStep <= onboardingSteps.length) {
      // Make sure we're getting the correct array index
      console.log(`Sending step ${nextStep}, array index ${nextStep - 1}`)

      if (onboardingSteps[nextStep - 1]) {
        const stepData = onboardingSteps[nextStep - 1].message

        await client.chat.postMessage({
          channel: userId,
          text: `Step ${nextStep}`,
          blocks: stepData.blocks,
        })
      } else {
        console.error(
          `Invalid step: ${nextStep - 1}, onboardingSteps length: ${
            onboardingSteps.length
          }`
        )
      }
    } else {
      console.log(`User ${userId} completed all steps`)
    }
  } catch (error) {
    console.error(`Error advancing to next step:`, error)
  }
}

// Handle welcome message trigger (case insensitive)
app.message(/hi/i, async ({ message, client }) => {
  // Only respond to direct messages
  if (message.channel_type === "im") {
    await startOnboarding(client, message.user)
  }
})

// Handle all onboarding button clicks
app.action(/^onboarding_.*$/, async ({ body, ack, client }) => {
  try {
    // Acknowledge the button click
    await ack()

    // Get the user ID
    const userId = body.user.id

    // Log which button was clicked
    console.log(
      `Button clicked by user ${userId}, action: ${body.actions[0].action_id}, value: ${body.actions[0].value}`
    )

    // Advance to next step regardless of which button was clicked
    await goToNextStep(client, userId)
  } catch (error) {
    console.error(`Error handling button click: ${error}`)
  }
})

// Super simple handler
app.message("test", async ({ message, say }) => {
  await say(`Hi there <@${message.user}>!`)
})

// Update your app startup slightly
;(async () => {
  await app.start()
  console.log("⚡️ Bolt app is running in Socket Mode!")
})()
