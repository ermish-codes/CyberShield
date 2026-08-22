export interface Choice {
  id: 'A' | 'B' | 'C';
  text: string;
  type: 'best' | 'risky' | 'bad';
  threatDelta: number; // -2, +1, or +2
  feedback: string;
  insight: string;
}

export interface ForwardedMessage {
  label?: string;
  sender: string;
  body: string;
  footer?: string;
}

export interface ScamPreview {
  label: string;
  title: string;
  url: string;
  body: string;
  footer?: string;
  note?: string;
}

export interface TradeOffer {
  sender: string;
  reputation?: string;
  message: string;
  link?: string;
}


export interface TournamentInvite {
  badge: string;
  sender: string;
  body: string;
}

export interface ThreatMessage {
  sender: string;
  body: string;
}

export interface FakeMessageCard {
  badge: string;
  sender: string;
  body: string;
  link: string;
}

export interface Scene {
  sceneNumber: 1 | 2 | 3 | 4;
  tag: string;
  title: string;
  notificationFeed?: string[];
  forwardedMessage?: ForwardedMessage;
  scamPreview?: ScamPreview;
  tradeOffer?: TradeOffer;
  tournamentInvite?: TournamentInvite;
  threatMessage?: ThreatMessage;
  fakeMessageCard?: FakeMessageCard;
  dialogue: { speaker: 'Kian' | 'Zara' | 'NOVA' | 'Ammi' | 'Sana' | string; text: string }[];
  choices: Choice[];
}

export interface PlaybookStep {
  title: string;
  description: string;
}

export interface PreventionTip {
  title: string;
  description: string;
}

export interface Debrief {
  heading: string;
  subtext: string;
  redFlags?: PreventionTip[];
  playbook: PlaybookStep[];
  prevention: PreventionTip[];
}

export interface CaseFile {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  scenes: Scene[];
  debrief: Debrief;
}

export const cases: CaseFile[] = [
  {
    id: 'gaming-account-hacked',
    number: 1,
    title: 'My Gaming Account Was Hacked',
    description: 'A live account takeover in progress. Secure your items, sessions, and recovery email before the attacker locks you out.',
    icon: '🎮',
    difficulty: 'Medium',
    scenes: [
      {
        sceneNumber: 1,
        tag: 'Case File 01 // The Alert',
        title: "Something's Wrong",
        notificationFeed: [
          '⚔️ Nova Arena: Item traded — Dragon Blade → unknown_user_4471',
          '🔑 Nova Arena: Your password was changed successfully',
          '➕ Nova Arena: 3 new followers added to your profile'
        ],
        dialogue: [
          { speaker: 'Zara', text: "bro did you just send me a 'free skins' link?? that's kinda sus ngl" },
          { speaker: 'NOVA', text: "Kian, I'm reading unusual activity on your account. Let's move fast but smart. What's your first move?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Click the link Zara got sent, to see what it actually is",
            feedback: "You tap the link. It opens a fake login page styled exactly like Nova Arena's. If you'd typed anything in, that credential would've gone straight to the attacker.",
            insight: "Why it's risky: A message coming from a friend's account (even if it's really an attacker) doesn't make a link safe. Attackers use hijacked accounts specifically because friends trust them. Never open links sent unexpectedly, even from people you know — verify through a separate channel first."
          },
          {
            id: 'B',
            type: 'risky',
            threatDelta: 1,
            text: "Panic and uninstall the game immediately",
            feedback: "You delete the app. It feels like action, but the attacker's session is still logged in on their end — deleting the game does nothing to lock them out.",
            insight: "Why it's incomplete: Removing the app doesn't revoke access. The actual fix has to happen inside your account settings — sessions, passwords, and permissions — not on your device."
          },
          {
            id: 'C',
            type: 'best',
            threatDelta: -2,
            text: "Go straight to account settings and check active sessions / login activity",
            feedback: "Smart. You find a login from an unfamiliar location, active right now. You didn't click anything suspicious and you're already looking at the real source of the problem.",
            insight: "Why it works: When something feels off, the first move is always to check where your account is actually being accessed from — not to interact with anything the potential attacker sent you."
          }
        ]
      },
      {
        sceneNumber: 2,
        tag: 'Case File 02 // First Move',
        title: 'Locking the Door',
        notificationFeed: [
          '📍 Active session: Unknown device — Location: unrecognized',
          '⏱️ Session started: 14 minutes ago — still active'
        ],
        dialogue: [
          { speaker: 'Kian', text: "okay there's literally someone logged in right now. what do I do first?" },
          { speaker: 'NOVA', text: "You need to cut their access, not just cover the crack. Pick your move." }
        ],
        choices: [
          {
            id: 'A',
            type: 'risky',
            threatDelta: 1,
            text: "Change the password and keep playing — that should be enough",
            feedback: "You change the password. But the attacker's session was already active before the change — on many platforms, an open session token doesn't get killed by a password change alone. They're still in.",
            insight: "Why it's incomplete: A password change stops new logins, not sessions that are already open. You have to explicitly log out all devices too."
          },
          {
            id: 'B',
            type: 'best',
            threatDelta: -2,
            text: "Change password, log out of ALL sessions/devices, and turn on two-factor authentication (2FA)",
            feedback: "The attacker's session gets killed instantly. With 2FA on, even if your password leaks again later, they can't get back in without your second factor.",
            insight: "Why it works: This closes every door at once — the current break-in, future password guesses, and repeat attempts. 2FA is the single strongest thing you can add to any gaming account."
          },
          {
            id: 'C',
            type: 'bad',
            threatDelta: 2,
            text: "DM 'unknown_user_4471' and politely ask for the Dragon Blade back",
            feedback: "They reply with another 'link to verify your identity.' It's the same trap, dressed differently. Negotiating just gives them a live target to keep working.",
            insight: "Why it's risky: Never engage directly with an attacker. It won't get stolen items back, and it often leads to more phishing attempts or your info being sold to other scammers."
          }
        ]
      },
      {
        sceneNumber: 3,
        tag: 'Case File 03 // The Blast Radius',
        title: 'How Far Did It Spread?',
        dialogue: [
          { speaker: 'Zara', text: "wait — is your email safe too? a lot of stuff resets through email" },
          { speaker: 'NOVA', text: "Zara's right to ask. Email is often the master key. What do you check next?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Nothing — the gaming account is what matters, email is a different thing",
            feedback: "Two days later, your account gets hacked again. Turns out the attacker had quietly set up a forwarding rule in your inbox and used it to reset the password right back.",
            insight: "Why it's risky: Your email is the recovery method for almost every account you own. If it's compromised, securing one account means nothing — they just walk back in through the front door."
          },
          {
            id: 'B',
            type: 'best',
            threatDelta: -2,
            text: "Check the linked email inbox for weird forwarding rules or login alerts, and secure it too (password + 2FA)",
            feedback: "You find a forwarding rule quietly sending copies of your emails to an address you don't recognize. You delete it, reset the email password, and turn on 2FA there too.",
            insight: "Why it works: Treating the email account as part of the breach — not a separate issue — closes the loop the attacker was relying on to get back in."
          },
          {
            id: 'C',
            type: 'risky',
            threatDelta: 1,
            text: "Only check if a credit card was charged, skip everything else",
            feedback: "No charges show up, so you stop looking. Good instinct to check payments, but the forwarding rule in your inbox stays active and undetected.",
            insight: "Why it's incomplete: Checking payment activity is genuinely important — just not the whole picture. A full check covers passwords, email, sessions, and payment methods together."
          }
        ]
      },
      {
        sceneNumber: 4,
        tag: 'Case File 04 // Report & Recover',
        title: 'Closing the Case',
        notificationFeed: [
          '🛡️ Status: Sessions revoked · 2FA enabled · Email secured'
        ],
        dialogue: [
          { speaker: 'Kian', text: "okay account feels locked down now. am I done?" },
          { speaker: 'NOVA', text: "Almost. Locking the account protects you going forward — but you can still do something about what already happened." }
        ],
        choices: [
          {
            id: 'A',
            type: 'risky',
            threatDelta: 1,
            text: "Quietly move on now that the password is changed",
            feedback: "You never file a report. The traded Dragon Blade is gone for good, and Nova Arena has no record that your account was compromised — so if this happens again, there's no history to point to.",
            insight: "Why it's incomplete: Reporting isn't just paperwork. Support teams can sometimes reverse fraudulent trades, flag the attacker's account, and log the incident in case you need it later."
          },
          {
            id: 'B',
            type: 'best',
            threatDelta: -2,
            text: "Report the compromise to official support with evidence, warn friends who got the phishing link, and monitor the account for a few days",
            feedback: "Support opens a case and flags the item trade for review. Zara deletes the link before anyone else clicks it. A week later, everything's quiet — case closed.",
            insight: "Why it works: Recovery isn't just technical — it's also about limiting damage to people around you and giving the platform a chance to help. This is the step most people skip."
          },
          {
            id: 'C',
            type: 'bad',
            threatDelta: 2,
            text: "Post the attacker's username publicly and call them out",
            feedback: "The post gets attention, but not the kind you want — the attacker's associates start targeting your socials, and support says public callouts don't help them investigate or violate their reporting process.",
            insight: "Why it's risky: Public callouts can invite harassment or doxxing back at you, rarely help recover anything, and can complicate an official investigation. Report through the platform's real channel instead."
          }
        ]
      }
    ],
    debrief: {
      heading: 'Case File Closed',
      subtext: "Whatever choices you made, here's the real playbook — the exact steps to take if your gaming account ever actually gets hacked.",
      playbook: [
        { title: 'Change your passwords — account and email', description: 'Use a long, unique password you haven\'t used elsewhere. A password manager makes this painless.' },
        { title: 'Turn on two-factor authentication (2FA)', description: 'Use an authenticator app over SMS where possible — it\'s the single biggest upgrade you can make.' },
        { title: 'Log out of all sessions and devices', description: 'A new password doesn\'t kill sessions that are already open — you have to revoke them directly.' },
        { title: 'Check your email for forwarding rules or filters', description: 'Attackers quietly forward your mail to reset other accounts later. Delete anything you didn\'t set up.' },
        { title: 'Report it to official support with evidence', description: 'Screenshots and timestamps help them investigate, reverse fraudulent trades, and flag the attacker.' },
        { title: 'Check linked payment methods', description: 'Look for unauthorized charges. If you find any, contact your bank or card provider right away.' },
        { title: 'Warn friends who may have received messages from your account', description: 'Compromised accounts are often used to phish the people who trust you most.' },
        { title: 'Monitor the account for the following days', description: 'Keep an eye on login activity and trades even after things look normal again.' }
      ],
      prevention: [
        { title: 'Never click "free skins" links', description: 'Even from friends. Verify through a different app or in person first.' },
        { title: 'Use a unique password per account', description: 'One leaked password shouldn\'t unlock everything else you own.' },
        { title: 'Only trade through official platforms', description: 'Third-party "trade boosting" sites are a top source of stolen accounts.' },
        { title: 'Guard your email like a vault', description: 'It\'s the recovery key to almost everything — secure it first, always.' }
      ]
    }
  },
  {
    id: 'whatsapp-free-gift-scam',
    number: 2,
    title: 'The WhatsApp "Free Gift" Scam',
    description: 'A social scam spreading through trusted family networks. Protect your family from a fake giveaway before it harvests their IDs and hijacks their accounts.',
    icon: '📱',
    difficulty: 'Easy',
    scenes: [
      {
        sceneNumber: 1,
        tag: 'Case File 01 // The Forward',
        title: "Ammi, You Won a Free iPhone?",
        forwardedMessage: {
          label: '↪️ Forwarded many times',
          sender: 'TeleLink Rewards 🎁',
          body: '🎉 CONGRATULATIONS! Your number has been randomly selected to win a FREE iPhone 15 from our 10th Anniversary Giveaway! Claim within 24 hours 👇',
          footer: 'tele-link-rewards-claim.net/winner'
        },
        dialogue: [
          { speaker: 'Ammi', text: "beta look!! I got picked for a free iPhone, your khala also got the same message, everyone in the group is sharing it!" },
          { speaker: 'Zara', text: "wait my mom sent this exact same one to our family group too... same '10th anniversary' thing" },
          { speaker: 'NOVA', text: "A message that's been forwarded dozens of times, claiming everyone 'randomly' won the same prize — what does that tell you, Kian?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Click the link yourself first to see if it's actually real before saying anything",
            feedback: "The page loads a flashy 'winner' screen with a countdown timer and asks you to enter your phone number to 'confirm eligibility.' It looks real enough that you almost don't question it.",
            insight: "Why it's risky: Scam pages are built to look convincing on purpose — the flashy design isn't proof of anything. Visiting the link at all, even 'just to check,' starts feeding your information into the scam funnel and can trigger malicious redirects or trackers."
          },
          {
            id: 'B',
            type: 'risky',
            threatDelta: 1,
            text: "Just tell Ammi 'that's fake' without explaining why, and move on",
            feedback: "Ammi shrugs and says 'maybe, but what's the harm in trying?' — and forwards it to two more relatives anyway, since you didn't actually explain what made it suspicious.",
            insight: "Why it's incomplete: Saying something is fake isn't the same as explaining the tell-tale signs. Family members keep falling for these unless they understand what to look for themselves next time."
          },
          {
            id: 'C',
            type: 'best',
            threatDelta: -2,
            text: "Point out the 'Forwarded many times' label and the fact that a real company doesn't run giveaways by random mass WhatsApp forward — then check the brand's actual official website/social page together with Ammi",
            feedback: "You and Ammi check TeleLink's real official website — there's no anniversary giveaway listed anywhere, and their real support account confirms it's a known scam being forwarded around.",
            insight: "Why it works: WhatsApp visibly labels heavily-forwarded messages for exactly this reason. Real brands announce giveaways on their own verified channels, not through chain messages — checking the official source directly is the fastest way to confirm or kill a claim like this."
          }
        ]
      },
      {
        sceneNumber: 2,
        tag: 'Case File 02 // The Form',
        title: "Just Fill This Out to Unlock It",
        forwardedMessage: {
          label: '🎁 Claim Form — TeleLink Rewards',
          sender: 'TeleLink Rewards 🎁',
          body: 'Enter your details below to receive your prize. To unlock delivery, share this message with 5 groups or 20 contacts.',
          footer: 'Requested: Full name · Home address · National ID number · Small ₨500 \'shipping confirmation\' payment'
        },
        dialogue: [
          { speaker: 'Ammi', text: "it's asking for my CNIC and a small shipping fee... and to share it with more groups. should I just do it, everyone else already has?" },
          { speaker: 'NOVA', text: "Look closely at what it's actually asking for, and why it needs to spread itself before anyone gets anything. What do you tell her?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Tell her to fill in everything including the CNIC number, and pay the ₨500 — it's a small price for a free iPhone",
            feedback: "The form submits fine and asks for a second 'customs release fee.' There's no iPhone coming — Ammi's ID number and payment details are now sitting in a scammer's database, and the site keeps asking for more money.",
            insight: "Why it's risky: 'Small' upfront fees for a 'free' prize are a classic scam pattern — legitimate giveaways never charge the winner. A national ID number combined with payment info can be used for identity fraud, not just this one scam."
          },
          {
            id: 'B',
            type: 'risky',
            threatDelta: 1,
            text: "Tell her to only fill in her name and phone number, skip the CNIC and payment, but still forward it to unlock delivery",
            feedback: "No CNIC was leaked, which helps — but the family group message gets forwarded further under your own family's name, making it look more credible to the next 20 people who receive it.",
            insight: "Why it's incomplete: Avoiding the riskiest fields is good instinct, but the 'share to unlock' mechanic is itself the scam's real goal — it uses trusted family and friend networks to spread automatically, turning victims into unwitting distributors."
          },
          {
            id: 'C',
            type: 'best',
            threatDelta: -2,
            text: "Explain that real prizes never require ID numbers, payments, or mass-forwarding to 'unlock' them — close the page and don't share it any further",
            feedback: "Ammi closes the tab. No information given, no money sent, and the message stops spreading through your family's contacts.",
            insight: "Why it works: Two huge red flags at once — asking for a payment to receive a 'free' prize, and requiring you to forward it before you get anything — are both hallmarks of self-spreading scam campaigns. Recognizing the pattern stops it cold."
          }
        ]
      },
      {
        sceneNumber: 3,
        tag: 'Case File 03 // The Blast Radius',
        title: "What Else Might Be Exposed?",
        dialogue: [
          { speaker: 'Zara', text: "wait, my mom said someone called her right after, pretending to be 'TeleLink support,' asking for a WhatsApp verification code to 'process her prize'" },
          { speaker: 'NOVA', text: "That's a second stage of the same scam — a WhatsApp account takeover attempt. What do you check?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Nothing to worry about, she didn't click the link, so her WhatsApp is fine",
            feedback: "You skip it. A few days later, Zara's mom's WhatsApp gets logged into from a new device — the 'support agent' had actually talked an earlier family member into reading out their 6-digit code over the phone.",
            insight: "Why it's risky: These scams often run in stages. Even if one person didn't click the link, a related follow-up call or message can target someone else in the same group using information gathered from the first attempt."
          },
          {
            id: 'B',
            type: 'best',
            threatDelta: -2,
            text: "Explain to the whole family that a WhatsApp verification code should NEVER be read out to anyone, then check WhatsApp Settings → Linked Devices for anything unfamiliar",
            feedback: "You walk Ammi and Zara's mom through it together. Nobody had shared a code yet, and Linked Devices shows only their own phones — clean. Everyone now knows the code is not to be shared, full stop.",
            insight: "Why it works: A WhatsApp verification code is the one thing that lets someone else log into your account as you. No real support agent, delivery company, or prize giveaway ever needs it — treating it as sacred and checking linked devices closes this exact attack path."
          },
          {
            id: 'C',
            type: 'risky',
            threatDelta: 1,
            text: "Just tell everyone to be 'more careful' in general, without checking any settings",
            feedback: "The advice is well-meant but vague — nobody actually checks Linked Devices, and a genuinely compromised account could stay unnoticed.",
            insight: "Why it's incomplete: General caution helps, but a specific check (Linked Devices, and the hard rule of never sharing a verification code) is what actually closes the door here."
          }
        ]
      },
      {
        sceneNumber: 4,
        tag: 'Case File 04 // Report & Protect the Family',
        title: "Stopping It Before It Reaches the Next Group",
        dialogue: [
          { speaker: 'Ammi', text: "okay beta, I won't forward these anymore. is that all we need to do?" },
          { speaker: 'NOVA', text: "One more thing — the message is still spreading to other families right now. You can help stop that part too." }
        ],
        choices: [
          {
            id: 'A',
            type: 'risky',
            threatDelta: 1,
            text: "Just delete the message from your own phone and move on",
            feedback: "Your family is safe, but the same message keeps circulating through other WhatsApp groups for weeks, catching people who don't have anyone to double-check it with them.",
            insight: "Why it's incomplete: Protecting your own family is the first job, but scam broadcasts like this spread fastest through the exact trust networks they exploit — a report can slow that down for others."
          },
          {
            id: 'B',
            type: 'best',
            threatDelta: -2,
            text: "Report and block the sending contact in WhatsApp, turn on Two-Step Verification for the family's accounts, and ask Ammi to tell the group where she first saw it not to forward it further",
            feedback: "WhatsApp flags the number after your report. Two-Step Verification means even a leaked code alone can't be used to log in. Ammi sends one clear message back up the chain, and the forwards in that branch stop.",
            insight: "Why it works: Reporting helps WhatsApp act on the number, Two-Step Verification adds a password on top of the code so a shared code alone isn't enough, and tracing the message back to its source (rather than just deleting your copy) actually interrupts the spread."
          },
          {
            id: 'C',
            type: 'bad',
            threatDelta: 2,
            text: "Reply directly to the 'TeleLink Rewards' number demanding they stop scamming people",
            feedback: "The number is unmonitored or auto-forwarding — no one reads it, and replying just confirms your number is active and attached to a real, responsive household, which can attract more spam.",
            insight: "Why it's risky: Engaging scam broadcast numbers directly accomplishes nothing productive and can mark your number as 'live' for future scam lists. Reporting through WhatsApp's own tool is what actually has an effect."
          }
        ]
      }
    ],
    debrief: {
      heading: 'Case File Closed',
      subtext: "'Free gift' broadcasts are one of the most-forwarded scams in the world precisely because they spread through people who trust each other. Here's how to spot and stop them.",
      redFlags: [
        { title: 'The "Forwarded many times" label', description: 'WhatsApp flags this automatically — treat it as an instant caution sign, not a footnote.' },
        { title: 'Everyone "randomly" wins', description: 'Real giveaways don\'t mass-select entire contact lists; a prize "everyone" gets is a distribution trick, not luck.' },
        { title: 'A fee to receive a "free" prize', description: 'Shipping fees, customs charges, or "processing" payments before a prize arrives are a hallmark of this scam category.' },
        { title: '"Share to unlock"', description: 'Any prize, gift, or reward that requires forwarding to more people before you get it is designed to spread itself, not reward you.' },
        { title: 'A follow-up call asking for a verification code', description: 'No real company, courier, or support agent ever needs your WhatsApp/OTP code read aloud — that request alone means it\'s a takeover attempt.' }
      ],
      playbook: [
        { title: 'Don\'t send any further payments', description: 'Scammers often ask for a "second fee" once the first is paid — stop at the first request, always.' },
        { title: 'Change the WhatsApp account\'s PIN and enable Two-Step Verification', description: 'Settings → Account → Two-Step Verification, so a code alone isn\'t enough to log in.' },
        { title: 'Check WhatsApp Linked Devices and remove anything unrecognized', description: 'Settings → Linked Devices — this shows every device currently logged into the account.' },
        { title: 'If a national ID, address, or payment info was submitted, treat it as exposed', description: 'Monitor bank statements and be alert for follow-up scam calls referencing the leaked details.' },
        { title: 'Report and block the number or broadcast contact in WhatsApp', description: 'This helps WhatsApp\'s systems flag and act on the source.' },
        { title: 'Tell the people you forwarded it to that it was a scam', description: 'Since it likely spread through your own contacts, a follow-up message can stop it going further.' }
      ],
      prevention: [
        { title: 'Treat "forwarded many times" as a warning label', description: 'It\'s WhatsApp itself telling you this message has spread unusually far.' },
        { title: 'Never share a verification code with anyone, ever', description: 'Not support, not delivery, not a "prize team" — no legitimate reason to ask exists.' },
        { title: 'Verify giveaways on the brand\'s real, official channel', description: 'A company\'s own verified website or social page will confirm or deny it in seconds.' },
        { title: 'Talk to family before forwarding, not after', description: 'A 10-second "does this seem off to you?" check stops most of these before they spread.' }
      ]
    }
  },
  {
    id: 'free-robux-vbucks-scam',
    number: 3,
    title: 'Free Robux / V-Bucks / Game Currency Scam',
    description: 'A "too good to be true" offer that promises instant free currency. Guide a younger player through recognizing the trap before they hand over their account.',
    icon: '💰',
    difficulty: 'Easy',
    scenes: [
      {
        sceneNumber: 1,
        tag: 'Case File 01 // The Generator',
        title: "It's Supposed to Just... Add Robux?",
        scamPreview: {
          label: '▶️ YouTube · 2.1M views',
          title: 'FREE ROBUX GENERATOR 2026 — 100% WORKING (NO HUMAN VERIFICATION!!)',
          url: 'robux-generator-free2026.xyz',
          body: 'Enter your Roblox username and password to log in and add up to 10,000 Robux instantly — FREE!'
        },
        dialogue: [
          { speaker: 'Sana', text: "Kian look!! this video says you just log in and it adds Robux for free, everyone in the comments says it worked for them!" },
          { speaker: 'Zara', text: "wait it's asking to log in with your actual password on some random site though?" },
          { speaker: 'NOVA', text: "Sana found something exciting — but let's think about how Robux actually gets into an account before trying it. What do you tell her?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Let her type in her real Roblox username and password — it says it needs to log in to add the currency",
            feedback: "The page accepts the login and shows a spinning 'Adding Robux...' animation for 30 seconds. Nothing is added — but the site now has Sana's real password, and by tomorrow the account is locked out and renamed by someone else.",
            insight: "Why it's risky: Roblox, Fortnite, and every real platform add currency directly inside their own official app or website when you buy or earn it — never through a third-party site asking for your password. Entering real credentials anywhere else hands the account straight to whoever built that site."
          },
          {
            id: 'B',
            type: 'risky',
            threatDelta: 1,
            text: "Tell her not to enter the password, but let her put in just her username so the site can 'look it up' first",
            feedback: "The site accepts the username and immediately jumps to a 'Verify You're Human' screen with surveys and app downloads. No password was leaked this time, but Sana is now deeper into the funnel and excited to finish what she started.",
            insight: "Why it's incomplete: Even a username alone isn't something a legitimate currency system needs from a third-party site. Sites like this collect usernames to make the process feel real and to keep you invested enough to complete the next, riskier step."
          },
          {
            id: 'C',
            type: 'best',
            threatDelta: -2,
            text: "Explain that Robux and V-Bucks can only ever be bought or earned inside Roblox's or Epic's own official app — anything outside that is automatically fake, no matter what the comments say",
            feedback: "Sana closes the video. 'Wait, so there's actually no way to get free Robux from a website at all?' — exactly. You explain the one rule that makes every version of this scam pointless: game currency only comes from the game itself.",
            insight: "Why it works: This is the single fact that defeats every 'generator' scam, no matter how convincing the site looks: no legitimate platform ever adds paid in-game currency through an outside website. Once you know that, there's nothing left to fall for."
          }
        ]
      },
      {
        sceneNumber: 2,
        tag: 'Case File 02 // The Human Verification',
        title: "Just One More Step to Unlock It",
        scamPreview: {
          label: '⏳ Verification Required',
          title: 'Verify You\'re Human',
          url: 'robux-generator-free2026.xyz/verify',
          body: 'To prevent bots, complete ONE offer below to unlock your Robux: download \'TurboCleaner App\' OR complete a short survey. Reward will be added automatically after!',
          note: 'psst — don\'t tell your parents about this trick, it might get patched if too many people find out! 🤫'
        },
        dialogue: [
          { speaker: 'Sana', text: "it wants me to download an app or do a survey to unlock it... and it says not to tell my mom? that's kind of weird actually" },
          { speaker: 'NOVA', text: "Notice what it's asking for — and notice that last line especially. What's your call?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Download the 'TurboCleaner App' since it's free and might unlock the Robux",
            feedback: "The app installs and immediately asks for a huge list of permissions — contacts, messages, and device admin access. Within a day, the device starts showing constant pop-up ads and a phone bill charge appears for a 'premium subscription' nobody signed up for.",
            insight: "Why it's risky: 'Complete this offer to unlock your reward' apps are a paid-referral scheme — the scam site gets paid for every install, and the app itself is often bundled with adware or something worse. No real reward was ever coming either way."
          },
          {
            id: 'B',
            type: 'risky',
            threatDelta: 1,
            text: "Skip the app and survey, but still leave the page open in case the 'timer' finishes on its own",
            feedback: "Nothing happens after waiting. Ten minutes later Sana's still checking it between rounds of her game, and the temptation to 'just try the survey real quick' creeps back in.",
            insight: "Why it's incomplete: Not completing the offer is good — but staying on the page keeps the door open to changing your mind later. The safest move is closing it entirely and walking away, not waiting to see what happens."
          },
          {
            id: 'C',
            type: 'best',
            threatDelta: -2,
            text: "Point out that 'don't tell your parents' is exactly the kind of thing a trustworthy website would never need to say — close the tab completely and don't complete any offer",
            feedback: "Sana closes it herself this time. 'That's actually really sus now that you say it out loud.' You both agree: anything that asks you to keep it secret from the people who look out for you is trying to stop you from getting a second opinion.",
            insight: "Why it works: Legitimate offers never need secrecy — asking you to hide something from a parent, guardian, or trusted adult is a manipulation tactic used specifically so nobody catches the scam before you're fully pulled in. Treating that line as an instant red flag protects you even when everything else looks convincing."
          }
        ]
      },
      {
        sceneNumber: 3,
        tag: 'Case File 03 // The Blast Radius',
        title: "Did Anything Actually Get Through?",
        dialogue: [
          { speaker: 'Zara', text: "even though you didn't finish it — should we double check nothing got in? like the account, or her phone?" },
          { speaker: 'NOVA', text: "Good instinct. A close call is still worth checking properly. Where do you look?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "No need — Sana didn't enter her password or download anything at the end, so there's nothing to check",
            feedback: "You skip it. It turns out the username she entered earlier was enough for the site to send a fake 'Roblox Support' friend request days later — one your family almost didn't catch either.",
            insight: "Why it's risky: Even a 'near miss' can leave a small trail — a username, an email typed into a related pop-up, a moment where a link was tapped. A quick check afterward costs almost nothing and catches anything that slipped through."
          },
          {
            id: 'B',
            type: 'best',
            threatDelta: -2,
            text: "Check Sana's Roblox account login history and friend requests for anything unusual, and check her device for any apps that may have installed themselves",
            feedback: "Everything on the account looks normal — no strange logins, no new friend requests yet. Her device shows no unfamiliar apps either. A clean check, and now Sana knows exactly what to look for herself next time.",
            insight: "Why it works: A short account and device check after any close call confirms there's genuinely nothing to worry about — or catches it early if there is. It only takes a few minutes and removes all the guesswork."
          },
          {
            id: 'C',
            type: 'risky',
            threatDelta: 1,
            text: "Only check the device for new apps, skip looking at the Roblox account itself",
            feedback: "The device looks clean, which is reassuring — but the account's login activity and friend requests never get reviewed, leaving a gap in the check.",
            insight: "Why it's incomplete: Device and account are two separate things that both need a look after a scam attempt — checking only one leaves the other's status unknown."
          }
        ]
      },
      {
        sceneNumber: 4,
        tag: 'Case File 04 // Report & Protect',
        title: "Making Sure It Doesn't Get the Next Kid",
        dialogue: [
          { speaker: 'Sana', text: "okay I get it now, I won't try stuff like that again. are we done?" },
          { speaker: 'NOVA', text: "Almost — that video has 2.1 million views. A lot of kids are seeing it right now. Want to do something about that too?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Just to be sure it's really fake, try the generator one more time with a made-up fake password",
            feedback: "The site accepts the fake password without complaint — which actually proves it never checks anything real, it just wants any input at all — but it also triggers another wave of pop-ups and redirects to more scam pages on the device.",
            insight: "Why it's risky: Testing a scam site 'just to see' still exposes the device to malicious scripts, redirects, and pop-ups, even with fake info. Once you've confirmed a pattern is a scam, the safest move is to leave and report it — not keep interacting with it."
          },
          {
            id: 'B',
            type: 'best',
            threatDelta: -2,
            text: "Report the video to YouTube, report the site if possible, tell a parent/guardian what happened, and set up a Roblox account PIN with Sana together",
            feedback: "YouTube's report goes through, a parent helps Sana set an account PIN so nobody can change settings without it, and you both agree to give the video's comment section a heads-up for other kids who might see it.",
            insight: "Why it works: Reporting helps get the video and site taken down for other viewers, telling a trusted adult means there's backup if anything was missed, and an account PIN adds a real layer of protection against exactly this kind of attempt in the future."
          },
          {
            id: 'C',
            type: 'risky',
            threatDelta: 1,
            text: "Just tell Sana to be more careful next time, no further action needed",
            feedback: "Good advice, but the video stays up, nobody else gets warned in the comments, and there's no extra protection added to the account going forward.",
            insight: "Why it's incomplete: 'Be careful' is a good habit but not a safeguard by itself — reporting the source and adding real account protection are what actually reduce the chance of this happening again."
          }
        ]
      }
    ],
    debrief: {
      heading: 'Case File Closed',
      subtext: "'Free Robux/V-Bucks generator' scams have targeted millions of young players for years. Here's how to recognize one instantly and what to do if a friend or sibling already tried one.",
      redFlags: [
        { title: 'It\'s outside the official app or website', description: 'Robux and V-Bucks can only ever be bought or earned inside Roblox\'s or Epic\'s own systems — anywhere else is automatically fake, regardless of how convincing it looks.' },
        { title: 'It asks for your real username or password', description: 'No legitimate currency system needs your login credentials on a third-party site, ever.' },
        { title: 'A "human verification" step involving surveys, downloads, or extra offers', description: 'This is the site earning money per install/survey — not a security check, and never leads to an actual reward.' },
        { title: 'Being told to keep it secret from parents or guardians', description: 'Trustworthy offers never require hiding themselves from the people who look out for you — this line exists purely to stop you getting a second opinion.' },
        { title: 'Big numbers, big urgency', description: '"Millions of views," countdown timers, and "before it gets patched" language are designed to rush excitement past caution.' }
      ],
      playbook: [
        { title: 'Change the game account\'s password immediately, with a trusted adult if needed', description: 'Use a new, unique password not used anywhere else.' },
        { title: 'Enable two-factor authentication or an account PIN if the platform supports it', description: 'Roblox and Epic both offer extra account-lock options built for exactly this.' },
        { title: 'Uninstall any app downloaded from the "verification" step', description: 'If possible, run a security scan on the device afterward.' },
        { title: 'Check account login history and friend/trade activity for anything unfamiliar', description: 'Look for logins from unrecognized locations or requests you didn\'t make.' },
        { title: 'Check for unexpected charges or subscriptions on a linked phone bill or payment method', description: 'Report and cancel anything unfamiliar right away.' },
        { title: 'Tell a parent or guardian what happened, even if it feels embarrassing', description: 'Catching it early is always better than hoping it resolves itself — and there\'s nothing to be embarrassed about, these scams are built to fool people.' }
      ],
      prevention: [
        { title: 'Currency only comes from the official store', description: 'If it\'s not inside the real app, it\'s not real Robux or V-Bucks.' },
        { title: 'Your password only ever goes on the official login screen', description: 'Never anywhere else, no matter what a site promises in return.' },
        { title: '"Keep it secret" is a red flag, not a bonus', description: 'Real offers don\'t need to hide from the adults in your life.' },
        { title: 'Ask before you try — not after', description: 'A 30-second check with an older sibling, friend, or parent stops almost all of these before they start.' }
      ]
    }
  },
  {
    id: 'fake-skin-trade-scam',
    number: 4,
    title: 'Fake Skin or In-Game Item Deal',
    description: 'A peer-to-peer trade scam using pressure and fake trust signals. Navigate a live negotiation to buy an item safely without falling for a setup.',
    icon: '💸',
    difficulty: 'Medium',
    scenes: [
      {
        sceneNumber: 1,
        tag: 'Case File 01 // The Deal',
        title: "Way Below Market Price",
        tradeOffer: {
          sender: 'RazorTrades#0417',
          reputation: '⭐ 5,247 successful trades · 100% positive',
          message: 'Selling my Phantom Blade skin, market price is usually 2,400 credits, I\'ll do it for 900 since I need credits fast. DM me if you want it, got 2 other people asking too.'
        },
        dialogue: [
          { speaker: 'Zara', text: "900 for a Phantom Blade? that's less than half price, that feels off" },
          { speaker: 'NOVA', text: "A deal that's dramatically better than market price, from someone you've never traded with — what's your move, Kian?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Send the 900 credits right away — the price is great and he's got over 5,000 trades, plus other buyers are waiting",
            feedback: "You send the credits. RazorTrades says 'sending now' — and then goes offline. The reputation screenshot turns out to be copied from a completely different trader's profile.",
            insight: "Why it's risky: A price far below market value combined with 'others are waiting' pressure is designed to make you act before checking anything. A pasted screenshot of 'reputation' proves nothing — it can be copied from anyone."
          },
          {
            id: 'B',
            type: 'risky',
            threatDelta: 1,
            text: "Ask him to send the item first, but otherwise agree to trade through his preferred method",
            feedback: "He sends what looks like the Phantom Blade skin — but when it lands in your inventory, it's a visually similar reskin with a different internal item ID, worth a fraction of the real one.",
            insight: "Why it's incomplete: Asking for the item first is a fair instinct, but it doesn't protect you if the trade itself doesn't happen through a system that verifies what's actually being sent. Fake or reskinned items can look identical at a glance."
          },
          {
            id: 'C',
            type: 'best',
            threatDelta: -2,
            text: "Tell him you'll only trade through the game's official trade system, and check his reputation through the platform's real trade history — not a screenshot he sent you",
            feedback: "You check the official trade history tool — RazorTrades#0417 has zero completed trades on record. The 'reputation' was fabricated. You decline the deal entirely.",
            insight: "Why it works: Official trade systems log real transaction history that can't be faked by a screenshot. A price that seems too good, paired with a reputation you can't independently verify, is exactly the setup a scam trade relies on."
          }
        ]
      },
      {
        sceneNumber: 2,
        tag: 'Case File 02 // The Middleman',
        title: "Just Use My Trusted Guarantee Site",
        tradeOffer: {
          sender: 'RazorTrades#0417',
          message: 'No worries, we can use a trade guarantee site so it\'s safe for both of us — everyone in the server uses it. Just send your item there first and it holds both sides until we\'re both ready.',
          link: 'tradeguard-escrow.net/secure-trade'
        },
        dialogue: [
          { speaker: 'Zara', text: "wait, that's not the game's actual trade system though, that's just some random website" },
          { speaker: 'NOVA', text: "A 'guarantee' that only exists outside the platform you're actually playing on — what do you think that really guarantees?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Send your item to the guarantee site first, since it's supposed to hold it safely for both sides",
            feedback: "The site accepts your item into its 'holding' system. RazorTrades confirms receipt, then stops responding. The site was never affiliated with the game at all — it was built purely to receive items that never come back.",
            insight: "Why it's risky: A trustworthy escrow only exists if it's actually run by the platform itself. A random third-party 'guarantee' site controlled by the trader (or their associate) has no real authority to return anything — it's just a place for your item to disappear."
          },
          {
            id: 'B',
            type: 'risky',
            threatDelta: 1,
            text: "Ask around in the trading server whether people trust this middleman site, and go ahead with it since a couple of people say it's fine",
            feedback: "Two accounts in the server vouch for the site enthusiastically — both created in the last week, likely the same person running extra accounts. You proceed and lose the item anyway.",
            insight: "Why it's incomplete: Checking with others is a good habit, but vouches from anonymous or brand-new accounts in the same server can be faked just as easily as a reputation screenshot. Verification needs an independent, harder-to-fake source."
          },
          {
            id: 'C',
            type: 'best',
            threatDelta: -2,
            text: "Explain that the only trade guarantee that actually means anything is the game's own built-in trade system — decline the external site entirely",
            feedback: "You hold firm. RazorTrades gets pushy for a minute, then disappears from the server entirely when you don't budge — a strong sign it was never a real trade to begin with.",
            insight: "Why it works: Official platforms build trade systems specifically so neither side can be scammed mid-trade. Any 'guarantee' that lives outside that system is, at best, unverifiable — and at worst, built specifically to look trustworthy while doing the opposite."
          }
        ]
      },
      {
        sceneNumber: 3,
        tag: 'Case File 03 // The Blast Radius',
        title: "What Did That Site Actually Get?",
        dialogue: [
          { speaker: 'Zara', text: "did that 'guarantee' site ask you to log in with your account at any point, or just take the item transfer?" },
          { speaker: 'NOVA', text: "Worth being sure. Sites like that sometimes ask for more than just the trade. What do you check?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "You never logged in anywhere on the site, so there's nothing else to check",
            feedback: "You move on without checking. A week later, you notice your account's linked email has a password-reset request you didn't make — the site's 'item holding' page had actually been running a hidden script in the background the whole time you had it open.",
            insight: "Why it's risky: Just visiting a malicious site can sometimes be enough to trigger tracking scripts or exploit attempts, even without typing in credentials. A quick account and session check afterward is worth doing regardless."
          },
          {
            id: 'B',
            type: 'best',
            threatDelta: -2,
            text: "Check your account's active sessions and recent login activity, and change your password as a precaution since you're not fully sure what the site did in the background",
            feedback: "You find no unfamiliar sessions, but you change the password anyway just to be safe. A week later, nothing unusual happens — the precaution cost you two minutes.",
            insight: "Why it works: When you don't know exactly what a shady site did, treating it as a possible exposure and checking account activity — plus a precautionary password change — closes any gap it might have opened, even if nothing turns out to be wrong."
          },
          {
            id: 'C',
            type: 'risky',
            threatDelta: 1,
            text: "Just uninstall the game and reinstall it fresh, without checking your actual account online",
            feedback: "Reinstalling the game does nothing to the account itself, which lives on the platform's servers, not on your device. Whatever state the account was in before is exactly the same after.",
            insight: "Why it's incomplete: Game files and account security are separate things. A device-level fix like reinstalling doesn't touch sessions, passwords, or anything tied to the account on the platform's side."
          }
        ]
      },
      {
        sceneNumber: 4,
        tag: 'Case File 04 // Report & Recover',
        title: "Closing the Deal for Good",
        dialogue: [
          { speaker: 'Kian', text: "okay, account looks clean and I didn't actually lose the item. anything else?" },
          { speaker: 'NOVA', text: "One thing left — RazorTrades is still in that server, probably setting up the same deal with someone else right now." }
        ],
        choices: [
          {
            id: 'A',
            type: 'risky',
            threatDelta: 1,
            text: "Just block RazorTrades and move on with your day",
            feedback: "You're safe, but RazorTrades simply messages the next interested buyer in the server a few minutes later with the exact same offer.",
            insight: "Why it's incomplete: Blocking protects you personally, but the same account keeps running the identical scam on other members of the server who have no idea what already happened."
          },
          {
            id: 'B',
            type: 'best',
            threatDelta: -2,
            text: "Report RazorTrades to the platform and the server moderators with screenshots of the conversation, and post a heads-up in the server for other traders",
            feedback: "Moderators remove RazorTrades from the server within the hour, and two other members reply thanking you — they were about to send the same 'guarantee site' link themselves.",
            insight: "Why it works: A report with evidence gives moderators and the platform enough to act on, and a public heads-up protects other members who were seconds away from the same trade you almost fell for."
          },
          {
            id: 'C',
            type: 'bad',
            threatDelta: 2,
            text: "DM RazorTrades pretending to be interested again, to try to bait him into a screenshot you can use to expose him yourself",
            feedback: "He senses something's off, screenshots your messages instead, and posts them out of context claiming you tried to scam him — muddying the situation and wasting time that a simple report would've resolved cleanly.",
            insight: "Why it's risky: Trying to personally 'catch' a scammer instead of reporting through official channels can backfire, waste time, and sometimes gets twisted against you. Moderators and platform reports exist specifically to handle this instead."
          }
        ]
      }
    ],
    debrief: {
      heading: 'Case File Closed',
      subtext: "Item and skin trading scams rely on pressure, fake trust signals, and 'guarantee' sites that don't actually guarantee anything. Here's how to trade safely.",
      redFlags: [
        { title: 'A price dramatically below market value', description: 'If a deal looks too good compared to everyone else\'s price, there\'s usually a reason — and it\'s rarely generosity.' },
        { title: 'Reputation you can\'t independently verify', description: 'Screenshots, claimed trade counts, and vouches from other accounts can all be faked or copied.' },
        { title: 'Pressure to act fast', description: '"Others are waiting" or urgency to decide quickly is designed to stop you from checking anything before you commit.' },
        { title: 'Any trade that leaves the platform\'s official system', description: '"Guarantee" or "escrow" sites not run by the game itself have no real authority to protect either side.' },
        { title: 'Being asked to send your item or payment first', description: 'Whoever sends first in an unverified trade is the one taking all the risk.' }
      ],
      playbook: [
        { title: 'Stop the trade immediately and send nothing further', description: 'Scammers often ask for "one more step" after the first loss — don\'t continue.' },
        { title: 'Check your account\'s session activity and change your password as a precaution', description: 'Especially if you visited or logged into any external "trade" site.' },
        { title: 'Screenshot the entire conversation before blocking', description: 'Evidence matters for the report and can\'t be recovered once a scammer deletes their messages.' },
        { title: 'Report the trader to the platform and any server/community moderators', description: 'Include the screenshots — this is what gets accounts banned and items flagged.' },
        { title: 'If a real-money payment was involved, contact your payment provider', description: 'Ask about a dispute or chargeback for an undelivered item.' },
        { title: 'Warn the community you traded in', description: 'A quick post can stop the same trader from reaching the next buyer.' }
      ],
      prevention: [
        { title: 'Only trade through the game\'s official system', description: 'If a "guarantee" exists outside that, it guarantees nothing.' },
        { title: 'Verify reputation through real trade history, not screenshots', description: 'Anyone can paste a fake number into a chat message.' },
        { title: 'A deal far below market price is a warning sign, not a bonus', description: 'Compare against multiple sources before assuming it\'s just luck.' },
        { title: 'Never send first in an unverified trade', description: 'If the other side won\'t go through official tools, that\'s the answer already.' }
      ]
    }
  },
  {
    id: 'fake-gaming-tournament',
    number: 5,
    title: 'Fake Gaming Giveaway or Tournament',
    description: 'An unsolicited "you\'ve been selected" approach that flatters real skill to lower your guard. Navigate the pressure to extract money and personal documents.',
    icon: '🏆',
    difficulty: 'Medium',
    scenes: [
      {
        sceneNumber: 1,
        tag: 'Case File 01 // The Selection',
        title: "You've Been Hand-Picked",
        tournamentInvite: {
          badge: '🏆 $5,000 PRIZE POOL',
          sender: 'NexQuest Esports — Talent Scouting',
          body: 'Congratulations! Our scouts reviewed your recent ranked matches and you\'ve been selected for our Regional Invitational. Elite players only — spots are extremely limited. A small $25 registration/insurance fee (paid via gift card) locks in your seat.'
        },
        dialogue: [
          { speaker: 'Zara', text: "wait since when do real tournaments scout randomly from ranked matches and DM you out of nowhere?" },
          { speaker: 'NOVA', text: "Being told you were personally scouted feels great — that's exactly the point. What's your move, Kian?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Pay the $25 gift card fee right away to lock in the spot before it fills up",
            feedback: "You buy and send the gift card code. 'NexQuest' confirms your registration — then stops responding entirely. The tournament never existed.",
            insight: "Why it's risky: Gift cards are untraceable and irreversible once the code is sent, which is exactly why scammers ask for them specifically instead of a normal, refundable payment method. No legitimate organization asks to be paid in gift cards."
          },
          {
            id: 'B',
            type: 'risky',
            threatDelta: 1,
            text: "Ask if there's a way to skip the fee, and when they say no, agree to pay half now and half later",
            feedback: "They happily accept a partial payment and immediately ask for the rest 'to finish processing your spot.' Negotiating the amount didn't address the real problem — there was never a real tournament to register for.",
            insight: "Why it's incomplete: Bargaining down a scam payment is still paying into a scam. The issue isn't the price, it's that a legitimate invitation wouldn't ask for gift-card payment or an unsolicited entry fee in the first place."
          },
          {
            id: 'C',
            type: 'best',
            threatDelta: -2,
            text: "Don't pay anything — search for NexQuest Esports' real official website and social accounts to see if this invitational is actually listed anywhere",
            feedback: "NexQuest Esports' real official page has no mention of a 'Regional Invitational,' and their real support account confirms they never DM players about registration fees. The invite was an impersonation using a real org's name.",
            insight: "Why it works: Real tournaments and organizations post official announcements on their own verified channels. Checking there directly — instead of trusting a DM's claims about itself — confirms or kills the story in minutes."
          }
        ]
      },
      {
        sceneNumber: 2,
        tag: 'Case File 02 // ID Verification',
        title: "Just Need to Confirm You're Real",
        tournamentInvite: {
          badge: '📋 REGISTRATION — STEP 2 OF 2',
          sender: 'NexQuest Esports — Talent Scouting',
          body: 'To finalize your spot and confirm eligibility (age & region rules), please upload a photo of your government ID and a selfie holding it. This keeps the tournament fair for everyone.'
        },
        dialogue: [
          { speaker: 'Kian', text: "it wants an actual photo of my ID and a selfie holding it now" },
          { speaker: 'NOVA', text: "Think about what a photo of your ID next to your face is actually useful for, outside of a real, already-established platform. What do you do?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Upload both the ID photo and the selfie — it's just for age/region verification",
            feedback: "The images go straight into a folder alongside dozens of others from different players. Weeks later, your name and ID number turn up used to open a fraudulent account elsewhere.",
            insight: "Why it's risky: A photo ID plus a selfie holding it is one of the most valuable identity-theft packages there is — it's often more than banks require for account verification. Handing that to an unverified DM has nothing to do with 'fair play' and everything to do with data harvesting."
          },
          {
            id: 'B',
            type: 'risky',
            threatDelta: 1,
            text: "Upload just the ID photo, skip the selfie, thinking that's a safer middle ground",
            feedback: "It's a smaller amount of exposure, but your government ID photo alone is still sent to an unknown party with no legitimate need for it — and no real tournament would need it in DMs regardless of how much you send.",
            insight: "Why it's incomplete: Reducing what you share is better than sharing everything, but the real issue is that an unverified DM has no business collecting government ID at all — partial exposure is still exposure."
          },
          {
            id: 'C',
            type: 'best',
            threatDelta: -2,
            text: "Refuse — explain that no legitimate tournament verifies identity through a DM, only within an already-established, official platform account",
            feedback: "You decline. 'NexQuest' pushes back claiming you'll 'lose your spot,' which only confirms it further — a real spot was never on the table to lose.",
            insight: "Why it works: Real age/region verification happens inside a platform you already have a verified account with, not by emailing photos of government ID to a stranger's DM. Refusing this step costs you nothing real, because there was nothing real to lose."
          }
        ]
      },
      {
        sceneNumber: 3,
        tag: 'Case File 03 // The Blast Radius',
        title: "What Did They Actually Get?",
        dialogue: [
          { speaker: 'Zara', text: "even though you didn't send your ID — did you check what happened with the gift card, or if they asked for anything else in the DMs before this?" },
          { speaker: 'NOVA', text: "Worth going back through the full conversation. What do you check?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Nothing to check, you didn't upload your ID, so it's over",
            feedback: "You move on. A month later, a friend on your team mentions the same 'NexQuest' account DMed them too, using details from your public profile to sound more convincing — the scam is still actively running, using information gathered from your exchange.",
            insight: "Why it's risky: Even a conversation that didn't end in ID or payment can still leak details a scammer reuses elsewhere — usernames, teammates, or platform habits mentioned along the way. A quick review helps you see what was actually said."
          },
          {
            id: 'B',
            type: 'best',
            threatDelta: -2,
            text: "Re-read the full DM thread for anything you shared (server names, real name, teammates, payment attempts), and check your payment method/gift card balance for any unauthorized use",
            feedback: "You realize you mentioned your team's practice schedule earlier in the chat, which is minor but worth noting. No payment or gift card was actually used. You flag the account's pattern to your team so they know what to watch for.",
            insight: "Why it works: Reviewing exactly what was shared — not just whether the 'worst case' (ID, payment) happened — gives you an accurate picture of what a scammer actually knows now, and lets you warn others about the specific tactic they're using."
          },
          {
            id: 'C',
            type: 'risky',
            threatDelta: 1,
            text: "Only check your bank statement, skip reviewing the actual DM conversation",
            feedback: "Your bank statement is clean, which is reassuring, but you never notice that the scammer picked up your teammate's name from earlier in the chat — information that gets used again in a follow-up attempt.",
            insight: "Why it's incomplete: A financial check matters, but it only covers money — it misses whatever personal or social information may have been shared in conversation before that point."
          }
        ]
      },
      {
        sceneNumber: 4,
        tag: 'Case File 04 // Report & Recover',
        title: "Making Sure the Next Player Doesn't Fall For It",
        dialogue: [
          { speaker: 'Kian', text: "okay, nothing lost, but this account is probably still messaging other players in our region" },
          { speaker: 'NOVA', text: "Almost certainly. This is the part most people skip — want to close the loop?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'risky',
            threatDelta: 1,
            text: "Just block the account and don't think about it further",
            feedback: "You're safe, but the account keeps DMing other high-ranked players in your region using the same script, and at least one teammate later admits they almost sent the gift card.",
            insight: "Why it's incomplete: Blocking protects you, but scam accounts like this specifically target multiple players in the same community — a report or a warning helps people who haven't seen it yet."
          },
          {
            id: 'B',
            type: 'best',
            threatDelta: -2,
            text: "Report the account to the platform for impersonation, contact the real NexQuest Esports to let them know their name is being used in a scam, and post a heads-up for your team/community",
            feedback: "The platform suspends the account within a day. The real NexQuest org thanks you and posts a public warning on their own channel. Two teammates message you later saying your heads-up stopped them from replying to the same DM.",
            insight: "Why it works: Reporting the impersonation gets it removed, telling the real organization helps them warn their actual community, and a heads-up to your own team closes the loop for the people most likely to be targeted next with the same script."
          },
          {
            id: 'C',
            type: 'bad',
            threatDelta: 2,
            text: "Reply pretending you're still interested, to string them along and 'waste their time' as payback",
            feedback: "They quickly realize you're stalling, block you first, and simply move to the next player on their list — no time was actually wasted on their end, and yours was.",
            insight: "Why it's risky: Scam accounts run the same script on many people at once; engaging playfully doesn't meaningfully disrupt them and can occasionally provoke targeted harassment back at you. A report does far more with far less risk."
          }
        ]
      }
    ],
    debrief: {
      heading: 'Case File Closed',
      subtext: "Fake 'you've been scouted' tournament invites use flattery instead of fear to lower your guard. Here's how to tell a real invitation from a setup.",
      redFlags: [
        { title: 'An unsolicited DM claiming you were personally scouted', description: 'Real esports orgs and tournaments recruit through open registration or known scouting relationships, not cold DMs to random ranked players.' },
        { title: 'A "registration" or "insurance" fee, especially via gift card', description: 'Legitimate tournaments don\'t charge entry fees payable only in gift cards — that payment method is chosen because it\'s untraceable.' },
        { title: 'A request for government ID plus a selfie holding it', description: 'This combination is a high-value identity-theft package, far beyond what any real age/region check needs from a DM.' },
        { title: 'Urgency about limited spots', description: '"Extremely limited" and "confirm now or lose your seat" pressure exists to stop you from checking whether the invite is real.' },
        { title: 'No trace of the event on the organization\'s real official channels', description: 'If a huge $5,000 tournament isn\'t announced anywhere on the org\'s actual website or socials, it isn\'t real.' }
      ],
      playbook: [
        { title: 'Stop all further payments or uploads immediately', description: 'Scammers often ask for "one more step" after the first one — don\'t continue the pattern.' },
        { title: 'If you paid via gift card, contact the gift card issuer right away', description: 'Report the card number as used in a scam; some issuers can flag or freeze remaining balance if caught fast enough.' },
        { title: 'If you uploaded ID, treat your identity as exposed', description: 'Consider a fraud alert or credit monitoring where available, and watch for accounts or services opened in your name.' },
        { title: 'Screenshot the full conversation before blocking', description: 'This is the evidence needed for both the platform report and the real organization\'s awareness.' },
        { title: 'Report the impersonating account to the platform', description: 'Impersonating a real esports org is a policy violation on nearly every platform and usually gets accounts suspended quickly.' },
        { title: 'Contact the real organization being impersonated', description: 'They can warn their actual community and may already be tracking the same scam pattern.' }
      ],
      prevention: [
        { title: 'Real scouting isn\'t cold-DM flattery', description: 'Being told you\'re "hand-picked" out of nowhere is a hook, not a compliment to trust blindly.' },
        { title: 'No real tournament is paid for in gift cards', description: 'That payment method alone is enough to end the conversation.' },
        { title: 'Government ID stays on platforms you already trust', description: 'Never sent fresh to a DM, no matter what "verification" is claimed.' },
        { title: 'Check the organizer\'s real channel before reacting to anything', description: 'A minute of searching confirms or kills almost every version of this scam.' }
      ]
    }
  },
  {
    id: 'ai-deepfake-scam',
    number: 6,
    title: 'AI Deepfake / Fake Photo Scam',
    description: 'An extortion scam relying on shame to keep you silent. Understand that this is a known, mass-produced tactic and learn exactly how to respond safely without engaging.',
    icon: '📸',
    difficulty: 'Medium',
    scenes: [
      {
        sceneNumber: 1,
        tag: 'Case File 01 // The Threat',
        title: "I Have a Photo of You",
        threatMessage: {
          sender: 'unknown_acc_88x2',
          body: 'I made a fake photo of you using AI and it looks real. Pay $200 in gift cards in the next hour or I send it to your followers, your school, and your family\'s socials.'
        },
        dialogue: [
          { speaker: 'Zara', text: "Kian what's wrong, you've been staring at your phone for like ten minutes" },
          { speaker: 'NOVA', text: "This is a serious message, and I want to be direct with you: this is a known scam pattern, and you are not the only target it's been sent to. What's your first move?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Pay the $200 immediately to make it go away before the deadline",
            feedback: "The payment goes through. An hour later, the same account messages again asking for $400 more, 'or the photo goes out anyway' — the deadline was never really about time at all.",
            insight: "Why it's risky: Paying doesn't end this kind of extortion — it confirms the threat worked, and the same account (or others working with it) almost always comes back asking for more. There is no version of this where paying makes it stop for good."
          },
          {
            id: 'B',
            type: 'risky',
            threatDelta: 1,
            text: "Reply and try to reason with them, explain you don't have money, ask them to just delete it",
            feedback: "They ignore the explanation entirely and repeat the same threat with a shorter deadline, pushing harder now that you've responded and shown the message is being read.",
            insight: "Why it's incomplete: Any reply — even a polite, reasonable one — confirms the account reached a real, responsive person. It doesn't buy sympathy; it usually increases the pressure instead."
          },
          {
            id: 'C',
            type: 'best',
            threatDelta: -2,
            text: "Don't reply and don't pay — screenshot the full message and account details as evidence, then tell Zara what's going on",
            feedback: "You save everything without responding. Having Zara know immediately means you're not carrying this alone, and the evidence is preserved no matter what the account does next.",
            insight: "Why it works: Not engaging removes the 'live target' response that keeps these accounts pushing, while screenshotting first preserves proof for a report before anything can be deleted or blocked out of reach. Telling someone you trust immediately also breaks the isolation the threat is counting on."
          }
        ]
      },
      {
        sceneNumber: 2,
        tag: 'Case File 02 // The Escalation',
        title: "Just Send One More Thing",
        threatMessage: {
          sender: 'unknown_acc_88x2',
          body: 'Fine, don\'t pay. Send me a real photo instead to prove you\'re not scared, or the fake one goes out to everyone in an hour.'
        },
        dialogue: [
          { speaker: 'Zara', text: "please don't send anything, that's exactly what they want" },
          { speaker: 'NOVA', text: "Every version of this ask — money, photos, anything — leads to the same place. What do you do?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Send a real photo, reasoning that it might satisfy them and end this",
            feedback: "The moment a real photo is sent, the entire situation gets worse — now there's real material to threaten with, on top of the fake one, and the demands increase immediately.",
            insight: "Why it's risky: There is no request in this situation that leads to it stopping — every demand, no matter how it's framed, is designed to escalate. Sending anything real turns a scam using a fake image into a genuinely dangerous situation."
          },
          {
            id: 'B',
            type: 'risky',
            threatDelta: 1,
            text: "Consider paying a small amount just to 'test' whether they'll actually stop this time",
            feedback: "A small payment goes through. The account treats it as proof you'll pay under pressure and immediately raises the amount for the next demand.",
            insight: "Why it's incomplete: Any payment, even a small 'test' one, confirms the tactic works on you. It doesn't buy information about their intentions — it invites a bigger version of the exact same threat."
          },
          {
            id: 'C',
            type: 'best',
            threatDelta: -2,
            text: "Recognize that the ask will never stop at 'one more thing' — block the account immediately without sending anything, and move straight to telling a trusted adult",
            feedback: "You block the account. The deadline passes. Nothing happens beyond the block, because the leverage they had was entirely dependent on you staying scared and responsive.",
            insight: "Why it works: These scams rely on an unbroken cycle of fear and compliance — blocking cuts that cycle immediately, and it's always safe to do, because there was never a real 'deal' to honor in the first place. Fake or edited images are usually sent as scare tactics designed to work on many people at once, not proof of an ongoing threat that requires negotiation."
          }
        ]
      },
      {
        sceneNumber: 3,
        tag: 'Case File 03 // The Blast Radius',
        title: "Making Sure You're Not Alone in This",
        dialogue: [
          { speaker: 'Kian', text: "I blocked them, but I'm scared to tell my parents, I don't even know how to bring it up" },
          { speaker: 'NOVA', text: "That fear is completely normal, and completely understandable — and it's also exactly what these scams count on to keep people silent. What do you do next?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Decide not to tell any adult, and just hope it's really over since the account is blocked",
            feedback: "Weeks later, a similar message arrives from a different account, referencing the same fake image — turns out blocking one account doesn't stop it from being shared further if it was already circulating before you blocked.",
            insight: "Why it's risky: Blocking stops direct contact from one account, but it doesn't undo anything that may already be in motion, and it doesn't give you access to the real tools (platform reporting, image-removal services, law enforcement) that can actually help contain it."
          },
          {
            id: 'B',
            type: 'best',
            threatDelta: -2,
            text: "Tell a parent, guardian, or another trusted adult what happened, with the screenshots as evidence, and ask for help reporting it properly",
            feedback: "It's an uncomfortable conversation, but your parent's reaction is relief that you told them, not anger. Together you report it through the right channels — and you're no longer carrying this alone.",
            insight: "Why it works: This kind of extortion is designed to isolate you with shame so you never tell anyone — telling a trusted adult breaks that isolation immediately, and gives you access to real reporting tools and support that you can't access alone. This is never something you're expected to handle by yourself."
          },
          {
            id: 'C',
            type: 'risky',
            threatDelta: 1,
            text: "Only tell Zara, and ask her to keep it just between the two of you, no adults",
            feedback: "Zara is supportive, but the two of you don't have access to the platform reporting tools or law enforcement contacts that could actually help remove the image or investigate the account.",
            insight: "Why it's incomplete: A trusted friend is genuinely valuable for support, but this situation benefits from an adult who can help navigate reporting and, if needed, involve people with real authority to act on it."
          }
        ]
      },
      {
        sceneNumber: 4,
        tag: 'Case File 04 // Report & Recover',
        title: "Cutting Off Every Path It Has Left",
        dialogue: [
          { speaker: 'Zara', text: "okay you told your parents, that's huge. what actually happens now?" },
          { speaker: 'NOVA', text: "A few concrete things — all of which take the power out of this completely." }
        ],
        choices: [
          {
            id: 'A',
            type: 'risky',
            threatDelta: 1,
            text: "Just wait and see if anything else happens, without reporting it anywhere",
            feedback: "Nothing happens for now, but the account (and any fake image it made) is never reported or removed from wherever it may exist, and nothing prevents the same tactic from being used on someone else.",
            insight: "Why it's incomplete: Waiting quietly might feel like the danger has passed, but it leaves the actual content and the account both unaddressed — reporting is what actually closes those out."
          },
          {
            id: 'B',
            type: 'best',
            threatDelta: -2,
            text: "Report the account and the message to the platform, and — with a trusted adult — report it to the appropriate resource for getting AI-generated or fake intimate images taken down and investigated",
            feedback: "The platform suspends the account for extortion. With your parent's help, you file a report through the proper channel for exactly this kind of situation — and you're told clearly that this is a known, common scam, and that you did everything right.",
            insight: "Why it works: Reporting to the platform removes the account's ability to contact anyone else. Reporting through the dedicated channel built for AI-generated or non-consensual imagery gets specialist help involved — these exist specifically because this scam is common enough to need dedicated support, and using them is free and confidential."
          },
          {
            id: 'C',
            type: 'bad',
            threatDelta: 2,
            text: "Try to track down who's behind the account yourself and confront them directly",
            feedback: "You find what looks like a lead, but it turns out to be another scam account entirely, and the confrontation goes nowhere except costing you time and stress that reporting would have handled safely.",
            insight: "Why it's risky: Investigating or confronting an anonymous extortion account yourself is unpredictable and can escalate a situation that trained reporting channels are built to handle safely. It's never on you to solve this alone."
          }
        ]
      }
    ],
    debrief: {
      heading: 'Case File Closed',
      subtext: "AI photo/deepfake extortion scams target huge numbers of people at once, counting on shame to keep them silent. If this ever happens to you: it is not your fault, it is a known scam, and help exists.",
      redFlags: [
        { title: 'A demand tied to a tight deadline', description: '"Pay in the next hour" is pressure designed to stop you from thinking clearly or telling anyone.' },
        { title: 'Payment requested in gift cards or crypto', description: 'Untraceable payment methods are chosen specifically because they can\'t be reversed or tracked.' },
        { title: 'Any "prove it" request for more photos or information', description: 'This is always an escalation, never a resolution — no request in this pattern ever leads to it stopping.' },
        { title: 'Threats to contact your followers, school, or family', description: 'This specific threat is used broadly across huge numbers of targets — it\'s a script, not something personal to you.' },
        { title: 'Pressure to stay silent or handle it alone', description: 'The scam only works if you don\'t tell anyone — that pressure itself is a sign you should tell someone immediately.' }
      ],
      playbook: [
        { title: 'Don\'t pay and don\'t send anything further', description: 'Nothing you send makes it stop — it only invites another demand.' },
        { title: 'Stop replying, and screenshot everything first', description: 'Save the messages, username, and any details before blocking, so there\'s evidence to report.' },
        { title: 'Block the account', description: 'This ends direct contact and removes their ability to keep pressuring you personally.' },
        { title: 'Tell a trusted adult — a parent, guardian, teacher, or counselor', description: 'This is genuinely not something you\'re expected to handle alone, and telling someone is the single most protective thing you can do.' },
        { title: 'Report the account to the platform it came from', description: 'Extortion is a policy violation everywhere, and reports like this are taken seriously.' },
        { title: 'Ask a trusted adult to help you report it through the dedicated channel', description: 'For AI-generated or non-consensual imagery involving minors or adults (in the US: NCMEC\'s "Take It Down" tool for anyone under 18, or StopNCII.org for adults). These services exist specifically for this and are free and confidential.' }
      ],
      prevention: [
        { title: 'A fake image doesn\'t need to be real to be used against you', description: 'Scammers create convincing fakes specifically to threaten people who have nothing "real" to hide.' },
        { title: 'No payment ever ends this kind of threat', description: 'Treat any "pay and it stops" claim as false from the start.' },
        { title: 'Tell someone immediately, before anything else', description: 'The earlier a trusted adult knows, the more can be done to help.' },
        { title: 'You are never the one at fault here', description: 'This is a scam built to exploit fear and shame — the responsibility sits entirely with whoever sent the threat.' }
      ]
    }
  },
  {
    id: 'fake-verification-scam',
    number: 7,
    title: 'Fake Discord / Steam / Valorant Verification',
    description: 'An aggressive phishing scam demanding immediate verification to avoid a ban. Spot the fake credentials and lock down your authorized apps.',
    icon: '⚙️',
    difficulty: 'Hard',
    scenes: [
      {
        sceneNumber: 1,
        tag: 'Case File 01 // The Message',
        title: "Your Account Will Be Suspended",
        fakeMessageCard: {
          badge: 'NOT VERIFIED',
          sender: 'Discord Trust & Safety',
          body: '⚠️ We\'ve detected unusual activity on your account. Verify your identity within 12 hours or your account will be permanently suspended.',
          link: 'discord-support-verify-center.com/confirm'
        },
        dialogue: [
          { speaker: 'Zara', text: "wait I got the exact same message but it says Steam?? word for word the same warning" },
          { speaker: 'NOVA', text: "Same message, different logo, sent to two people at once — that's not a coincidence. What's your move, Kian?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Click the link fast — 12 hours doesn't feel like much time to lose your account",
            feedback: "The page looks identical to Discord's real login. You type your username and password. They're gone the second you hit enter — sent straight to the scammer's server.",
            insight: "Why it's risky: Urgency is the whole trick. Real platforms don't threaten permanent suspension over DM with a countdown clock — that pressure exists purely to stop you from thinking it through."
          },
          {
            id: 'B',
            type: 'risky',
            threatDelta: 1,
            text: "Ignore it completely and delete the message, no further action",
            feedback: "Deleting it protects you personally — but the same message is still being sent to everyone in your server, and nobody reports it, so it keeps spreading.",
            insight: "Why it's incomplete: Not falling for it is step one. But scam messages like this should also be reported so the platform can shut the sender down before it reaches more people."
          },
          {
            id: 'C',
            type: 'best',
            threatDelta: -2,
            text: "Check the sender's real username/URL — official platforms don't DM 'verify or be banned' — then report without clicking anything",
            feedback: "You look closely: the link isn't discord.com, and the account messaging you is a random user, not an official one. You screenshot it and report it without ever touching the link.",
            insight: "Why it works: Discord, Steam, and Riot never DM you demanding urgent 'verification' through a link. Checking the actual domain and sender before reacting is the single habit that stops almost every version of this scam."
          }
        ]
      },
      {
        sceneNumber: 2,
        tag: 'Case File 02 // The Fake Verify Bot',
        title: "A Bot Asks for Access",
        fakeMessageCard: {
          badge: 'UNOFFICIAL',
          sender: '⚡Steam-Guard-Verify (Bot)',
          body: 'To keep chatting in this server, authorize this app with your account and enter the code sent to you.',
          link: 'Requested permissions: read messages · manage server · read friends list · read trade offers'
        },
        dialogue: [
          { speaker: 'Kian', text: "a bot just popped up in the server DMs asking me to authorize it and enter a code" },
          { speaker: 'NOVA', text: "Look at what it's actually asking to access, not just what it's called. What do you do?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Authorize the app right away — it's just to keep chatting in the server",
            feedback: "The app gets full access to your friends list, messages, and trade offers. Within the hour it's DMing everyone on your friends list the same fake verification link — using your account to spread itself.",
            insight: "Why it's risky: OAuth 'authorize this app' prompts are real permission grants, not just a login. An app asking for 'manage server' or 'read trade offers' just to let you chat is a massive mismatch — that gap is the scam."
          },
          {
            id: 'B',
            type: 'risky',
            threatDelta: 1,
            text: "Enter the verification code it sent, since it seems tied to your real account",
            feedback: "The 'code' was actually your real Steam Guard code — the scam site relayed your login attempt to the real Steam servers and used your code to log in as you, in real time.",
            insight: "Why it's incomplete: A verification code is only safe to enter on a service you initiated the login with. If a message asks you to hand over a code someone else triggered, that code logs them in, not you."
          },
          {
            id: 'C',
            type: 'best',
            threatDelta: -2,
            text: "Check the requested permissions, notice the mismatch, decline the authorization, and report the bot to server mods",
            feedback: "You read the permission list — 'manage server' and 'read trade offers' have nothing to do with a chat verification. You decline, and a mod bans the bot minutes later.",
            insight: "Why it works: Reading exactly what an app is requesting — before tapping Authorize — is the real verification step. Legitimate verification never needs server management or trade access."
          }
        ]
      },
      {
        sceneNumber: 3,
        tag: 'Case File 03 // The Blast Radius',
        title: "What Else Did It Touch?",
        dialogue: [
          { speaker: 'Zara', text: "even if you didn't fall for it — should we check if anything's already connected to your accounts from before?" },
          { speaker: 'NOVA', text: "Good instinct. Old authorized apps are one of the most overlooked risks. Where do you look?" }
        ],
        choices: [
          {
            id: 'A',
            type: 'bad',
            threatDelta: 2,
            text: "Nothing to check — you didn't authorize anything today, so you're fine",
            feedback: "You skip it. Turns out a 'free Nitro' bot you authorized months ago is still connected with message-read access, quietly logging your DMs this whole time.",
            insight: "Why it's risky: Old authorizations don't expire just because you forgot about them. A scam from months ago can still be actively working in the background."
          },
          {
            id: 'B',
            type: 'best',
            threatDelta: -2,
            text: "Open Discord/Steam/Riot account settings, review Authorized Apps and Connections, and revoke anything you don't recognize or no longer use",
            feedback: "You find two old bots with message and friends-list access you never use anymore. You revoke both — instantly cutting off data they could still be pulling.",
            insight: "Why it works: Every account with third-party integrations builds up authorized apps over time. A regular check-and-revoke habit closes doors you forgot were ever open."
          },
          {
            id: 'C',
            type: 'risky',
            threatDelta: 1,
            text: "Only check your email inbox, skip the platform's own connected-apps settings",
            feedback: "Your email looks clean. But the actual risky connections live inside Discord and Steam's own authorized-app settings — a spot you never looked.",
            insight: "Why it's incomplete: Email is one piece of the picture. Gaming and chat platforms track their own authorized third-party apps separately, and that's exactly where this type of scam plants itself."
          }
        ]
      },
      {
        sceneNumber: 4,
        tag: 'Case File 04 // Report & Lock Down',
        title: "Shutting It Down for Good",
        dialogue: [
          { speaker: 'Kian', text: "okay I've revoked the sketchy apps. anything else before I'm done?" },
          { speaker: 'NOVA', text: "Almost. This scam is still live and hitting other people right now — you can help stop that too." }
        ],
        choices: [
          {
            id: 'A',
            type: 'risky',
            threatDelta: 1,
            text: "Nothing else — you personally are safe now, that's enough",
            feedback: "You move on. The fake 'Steam-Guard-Verify' bot stays active in the server for another two weeks, catching a handful of newer members before anyone reports it.",
            insight: "Why it's incomplete: Being safe yourself is step one, but scam bots and impersonator accounts keep operating until someone actually reports them to the platform."
          },
          {
            id: 'B',
            type: 'best',
            threatDelta: -2,
            text: "Report the bot/account through the platform's official report tool, warn the server, and turn on 2FA everywhere it isn't already on",
            feedback: "The bot gets banned within a day after your report. Your warning post stops three other members from clicking the same link. With 2FA on everywhere, even a leaked password now isn't enough to get in.",
            insight: "Why it works: Reporting protects the community, not just you. And 2FA is the backstop that makes future phishing attempts fail even if a password ever does leak."
          },
          {
            id: 'C',
            type: 'bad',
            threatDelta: 2,
            text: "Reply to the fake support account demanding they leave you alone",
            feedback: "They don't care — it's a bot account with no one reading replies. Engaging just confirms your account is active, which can get it added to lists for future scam attempts.",
            insight: "Why it's risky: Scam accounts and bots aren't reasoned with. Engaging does nothing productive and can mark you as a responsive target for future attempts. Report through official channels instead."
          }
        ]
      }
    ],
    debrief: {
      heading: 'Case File Closed',
      subtext: "Fake 'verify your account' scams hit Discord, Steam, and Valorant/Riot accounts constantly. Here's how to spot them and lock down for real.",
      redFlags: [
        { title: 'Urgency + threats', description: '"Verify in 12 hours or be banned" is pressure designed to stop you thinking, not a real policy.' },
        { title: 'The link isn\'t the real domain', description: 'discord-support-verify-center.com is not discord.com. Always check the actual URL, not just the button text.' },
        { title: 'Random accounts messaging you first', description: 'Real platform support doesn\'t DM random users demanding "verification" through a link.' },
        { title: 'Permission requests that don\'t match the ask', description: 'A "chat verify" bot never needs trade access, message history, or server management.' },
        { title: 'Being asked for a code you didn\'t request', description: 'If you didn\'t trigger the login, that code is meant to log someone else in as you.' }
      ],
      playbook: [
        { title: 'Change your password immediately — account and linked email', description: 'Use a long, unique password you haven\'t used elsewhere.' },
        { title: 'Revoke the authorized app / bot from account settings', description: 'Discord: User Settings → Authorized Apps. Steam: Settings → Manage Steam Guard/Authorized Devices. Riot: Account → Connections.' },
        { title: 'Log out of all active sessions', description: 'This kills any session the scam already opened, even after you change your password.' },
        { title: 'Turn on two-factor authentication (2FA)', description: 'Use an authenticator app where possible — it stops future attempts even if a password leaks.' },
        { title: 'Report the account/bot through the platform\'s official tool', description: 'This gets it banned and protects other people who\'d otherwise receive the same message.' },
        { title: 'Warn friends and your server', description: 'Compromised accounts almost always get used to send the same scam to everyone you know.' },
        { title: 'Check trade history and inventory (Steam/Valorant)', description: 'Look for unauthorized trades or item transfers and report any you find to official support.' }
      ],
      prevention: [
        { title: 'Type URLs yourself for anything sensitive', description: 'Don\'t follow "verification" links — go to the site directly and check settings there.' },
        { title: 'Never share a login code someone else asked for', description: 'A real code request only ever comes from a login you personally started.' },
        { title: 'Review authorized apps every few months', description: 'Old bots and integrations pile up — clear out anything you don\'t actively use.' },
        { title: 'Treat "official support" DMs as suspicious by default', description: 'Real support responds in tickets you opened, not surprise DMs demanding action.' }
      ]
    }
  }
];

