'use strict';
// Exact curriculum copy from the Command Centre; release authorized by owner 1 November 2026.
const episodeGames={
  "6-8": {
    "intro": "Welcome to Path Picker! Three little moments, three chances to choose wisely. Pick what you would do and discover where the path leads!",
    "completion": "You found three Wisdom Stars! Remember: stop, think and choose kindness. God's Word can help you along the way!",
    "scenes": [
      {
        "id": "PP1",
        "title": "THE PENCIL PRANK",
        "prompt": "Your friend says, “Let's hide Ama's pencil case. It will be funny!” What will you do?",
        "connection": "Psalm 1:1 reminds us that we don't have to follow advice that leads us to do wrong.",
        "teacherNote": "This is a hypothetical scenario. Do not invite children to hide actual property.",
        "choices": [
          {
            "id": "A",
            "label": "Hide it for a laugh.",
            "outcome": "Ama cannot find her pencils and feels worried. A joke that hurts someone isn't kind. Want to try another choice?",
            "acceptable": false
          },
          {
            "id": "B",
            "label": "Say no and leave it where it is.",
            "outcome": "You kept Ama's things safe. You can be friendly without joining an unkind prank. Wisdom Star earned!",
            "acceptable": true
          }
        ]
      },
      {
        "id": "PP2",
        "title": "ROOM FOR ONE MORE",
        "prompt": "A new child asks to play. Your friend says, “Tell them to go away.” What will you do?",
        "connection": "Psalm 1:2 invites us to enjoy God's teaching and let it guide how we treat people.",
        "teacherNote": "Inclusion should be safe and supervised; a parent or teacher can help with turns and boundaries.",
        "choices": [
          {
            "id": "A",
            "label": "Say, “You can't play with us.”",
            "outcome": "The child feels left out. Following a friend is not always the kindest choice. Try another way?",
            "acceptable": false
          },
          {
            "id": "B",
            "label": "Say, “Let's find a way to play together.”",
            "outcome": "You helped someone feel welcome! Your friend can learn kindness from you too. Wisdom Star earned!",
            "acceptable": true
          }
        ]
      },
      {
        "id": "PP3",
        "title": "THE BROKEN CUP",
        "prompt": "Oops! You accidentally break a cup. Nobody saw it. What will you do next?",
        "connection": "Thinking about God's teaching, as Psalm 1:2 describes, helps us pause and choose truthfulness.",
        "teacherNote": "Children must not handle shards; choose a harmless plastic prop in illustrations.",
        "choices": [
          {
            "id": "A",
            "label": "Hide the cup and say nothing.",
            "outcome": "The grown-up won't know what happened, and the broken cup may be unsafe. Let's find a wiser choice.",
            "acceptable": false
          },
          {
            "id": "B",
            "label": "Tell a grown-up what happened.",
            "outcome": "Telling the truth helps a grown-up keep everyone safe. Accidents happen, and asking for help is wise. Wisdom Star earned!",
            "acceptable": true
          }
        ]
      }
    ]
  },
  "9-12": {
    "intro": "Every choice has a story. Explore three real-life situations, see what happens, then try another path. Some situations have more than one wise response.",
    "completion": "You explored all three stories! Wisdom isn't always about having a perfect answer. It's about thinking carefully, choosing kindness and knowing when to ask for help.",
    "scenes": [
      {
        "id": "CC1",
        "title": "THE GROUP CHAT PHOTO",
        "prompt": "A class group chat shares an embarrassing picture of another child. People are laughing. What would you do?",
        "connection": "Psalm 1:1 warns us not to be shaped by mocking or harmful advice, even when a group approves of it.",
        "teacherNote": "Do not ask children to expose chat messages, share private images, confront bullies or intervene alone.",
        "choices": [
          {
            "id": "A",
            "label": "Forward it so everyone sees.",
            "outcome": "The picture spreads further and could hurt the child more. Being popular isn't a good reason to add to the harm.",
            "acceptable": false
          },
          {
            "id": "B",
            "label": "Don't share it. Check in kindly with the child.",
            "outcome": "You stopped the picture spreading and showed someone they aren't alone. That's a thoughtful choice.",
            "acceptable": true
          },
          {
            "id": "C",
            "label": "Don't share it. Ask a trusted adult for help.",
            "outcome": "You chose not to spread the harm and involved someone who can help keep others safe. That's wise too.",
            "acceptable": true
          }
        ]
      },
      {
        "id": "CC2",
        "title": "THE CLASSROOM RUMOUR",
        "prompt": "Someone tells you a rumour about a classmate, but you don't know whether it's true. What will you do?",
        "connection": "Psalm 1:1 asks us to consider the influence we accept instead of joining in when others mock someone.",
        "teacherNote": "If the rumour suggests immediate danger or abuse, seek trusted adult support rather than treating it as ordinary gossip.",
        "choices": [
          {
            "id": "A",
            "label": "Repeat it because everyone is talking.",
            "outcome": "The rumour grows, even though nobody has checked the facts. Repeating something can cause harm.",
            "acceptable": false
          },
          {
            "id": "B",
            "label": "Say, “We don't know if that's true. Let's not spread it.”",
            "outcome": "You chose honesty and stopped the rumour from growing. That can protect someone's dignity.",
            "acceptable": true
          },
          {
            "id": "C",
            "label": "Step away and refuse to pass it on.",
            "outcome": "You didn't help the rumour spread. Sometimes a quiet boundary is a wise first step.",
            "acceptable": true
          }
        ]
      },
      {
        "id": "CC3",
        "title": "A FRIEND NEEDS HELP",
        "prompt": "A friend says, “People keep teasing me at school. Please don't tell anyone.” What would you do?",
        "connection": "Psalm 1:2 points us toward thoughtful, ongoing attention to God's instruction. Wisdom includes kindness, good judgment and knowing when to seek help.",
        "teacherNote": "Never promise absolute secrecy about safety. Avoid asking for disclosures on the website. If a child is at risk, adults must follow applicable safeguarding procedures.",
        "choices": [
          {
            "id": "A",
            "label": "Promise to keep it secret, even if they are unsafe.",
            "outcome": "Your friend may need more support than you can give alone. Keeping someone safe matters more than making an unsafe promise.",
            "acceptable": false
          },
          {
            "id": "B",
            "label": "Listen kindly and offer to find a trusted adult together.",
            "outcome": "You listened, showed care and helped your friend seek support. That's a brave and wise response.",
            "acceptable": true
          },
          {
            "id": "C",
            "label": "Tell a trusted adult who can help, even if your friend feels unsure.",
            "outcome": "You took the concern seriously and involved someone who can help. You can reassure your friend that you care.",
            "acceptable": true
          }
        ]
      }
    ]
  }
};
