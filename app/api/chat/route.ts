import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

// Context about Hands of Hope for the AI
const HANDS_OF_HOPE_CONTEXT = `
Cofounders Daksh Shah and Shubham Trivedi as well as the chief executives will remain a part of this organization even after highschool. 

 Simplified bylaws of Hands of Hope Nonprofit:

1. Use of mobile phones during meetings is prohibited. A member using their phone will receive a warning. If the same member uses their phone a second time, their phone will be confiscated. If the member uses their phone a third time, they will be required to complete a service project; refusal to do so will result in expulsion from the organization.
  
2. All decisions made by co-founders or those in leadership positions are considered final.

3. Horseplay of any kind is strictly prohibited during meetings, adhering to a three-strike system.

4. All interactions must be conducted respectfully during meetings and interruptions are not allowed.

5. For every two people recruited, a member will earn three service hours of credit. Recruitment is only permitted if the branch is below its maximum capacity of 35 members.

6. Freshmen may transfer a maximum of 30 hours from other clubs, sophomores may transfer 40 hours, and juniors and seniors may transfer 50 hours towards the President's Volunteer Service Award (PVSA). Documentation of hours must be provided.


8. All board members must be in the same grade or a higher grade than the president or co-founder.

9. If a member indicates attendance at an event or meeting but fails to inform us of an absence, it will be recorded as an unexcused absence. A member accumulating more than seven unexcused absences in a school year will be banned from the organization. Notifications of absences should be made via text in your given branch group chat.


11. Failure of any leadership position to fulfill their responsibilities will be reviewed by the board. If the majority determines that the individual has not satisfactorily completed their tasks, they may be demoted or removed from the organization, and the board will appoint a suitable replacement.

12. All volunteer hours will be tracked through our website where members and leadership alike will be able to log in and request hours which their branch leader will approve to verify them.

13. Every leadership in hands of hope has to sign a contract except for branch regulators. The branch leader and chief executive contract is different 
Branch leader requirements once elected:
1.         $40 fee
2.         Signed Contract
3.         20 members, with each of them having filled out the form and regulated professional group norms (group chat)
4.        Get added in HCB as a member so you can track our donations and see if you are meeting ur goals
4.         50 followers (this includes you and your branch members) 
5.         A separate Hands of Hope email must be created for your branch, where you will reach out to organizations. FORMAT:
handsofhope.YOURHIGHSCHOOLNAME@gmail.com
6.         Minimum quota of $500 raised per year
7.         1 meeting per month (During the School year)
8.         Becoming school-sponsored within one year of branch operation (this gives time for branches started at the beginning of a given school year.
9.         All required school events have to be fulfilled (when school-sponsored)
10.    One volunteering event focused on helping the homeless once a month, sponsored by an outside organization that you had reached out to prior to volunteering. (During the School year [NOTE** this does not apply to August as the main purpose of that month will be fully introducing our org to your branch’s members])
11.    Maintain a relationship with an outside organization for sustainable, regulated, scheduled, consistent volunteering. 
12.    7 high-quality pictures per event (this will serve as proof and will also be used on our Instagram)
13.    1 flyer for each event is made before the event and sent out to all members
14.    Each event must contain 15+ people 
How Branch Leaders get monitored:
Depending on which country your branch is located in (Canada, U.S), our American Region Leader, Satyajeeth Suresh Kannan, or Canadian Region Leader, Adithya Prasana Kumar, will be monitoring your branch and making sure you are actively working to meet the goals you are required to and implementing effective strategies, and most of all, actually making progress. He will monitor your branch by being in your branch group chat (by doing so, he will effectively find the number of members your branch has, your leadership, if you all are participating in school events, if you are participating in your monthly event, and your overall branch productivity). He will also be contacting you personally each month, asking for details on what exactly your branch did this month. All monitoring will be handled by him. If you’re having a hard time reaching a goal, just reach out to him and he’ll help you with whatever you need. 
Student leadership in hands of hope:
| **Category**     | **Chief Officers/Executives**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | **Region Leaders**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | **Branch Leaders**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | **Branch Regulators**                                                                                                                                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Benefits**     | - Mentioned as a core leadership team on Instagram and website.<br>- 1.7× service hours on all activities done for the organization.<br>- Ability to regulate one part of Hands of Hope that no one else can regulate (a role that no one except Co-founders can do).<br>- Gets to appoint leadership positions that are below their level (Branch regulators) with Co-founder approval.<br>- Official member of the Hands of Hope board.<br>- Leadership meetings.<br>- Executive meetings for planning and furthering our organization.<br>- Can edit/suggest parts of the three major events that Hands of Hope sponsors.<br>- Official business card.<br>- Complete Access to Google Drive and a folder that tracks their activities and tasks.<br>- Has access to the Hands of Hope HCB as a member or manager depending on position.<br>- Can delegate a specific task to a branch regulator and treat them as an intern (Junior Chief Officer).<br>- This intern can be removed by the Chief Officer or can become permanent with Co-founder approval. | - Mentioned as a core leadership team on Instagram and website.<br>- 1.6× service hours on all activities done for the organization.<br>- Ability to regulate multiple sectors of Hands of Hope at once (including branches).<br>- Gets to appoint leadership positions that are below their level with Co-founder approval.<br>- Minimum wage opportunity.<br>- Official member of Hands of Hope Board.<br>- Has discretionary authority on how to keep their region operational.<br>- Leadership meetings.<br>- Official business card.<br>- Complete Access to the Google Drive.<br>- Has access to HCB as a member.<br>- Can start a branch with Co-founder approval and can remove a branch with Co-founder approval. | - Mentioned as core leadership team on Instagram and website.<br>- 1.5× service hours on all activities done for the organization.<br>- The face of the school that they manage (includes responsible for their meetings and events).<br>- Gets to appoint Branch regulators with Co-founder approval.<br>- Official member of the Hands of Hope Board.<br>- Has discretionary authority on how to keep their school operational.<br>- Has access to HCB as a member/reader.<br>- Official business card. | - 1.3× service hours on all activities done for the organization.<br>- Official member of their School board.<br>- Leadership meetings.<br>- Has access to a specific item that members in their branch do not have access to (volunteer hours, logs, email, etc.). |
| **Requirements** | - Has to be the same grade level as the Co-founders or higher.<br>- $50 fee.<br>- 3.8 GPA or higher.<br>- Has to sign a contract for their position.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | - Has to be the same grade level as the Co-founders or higher.<br>- \$50 fee.<br>- 3.6 GPA or higher.<br>- Has to sign a contract for their position.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | - Has to be the same grade level as the Co-founders or higher.<br>- \$20 fee.<br>- 3.3 GPA or higher.<br>- Has to sign a contract for their position.                                                                                                                                                                                                                                                                                                                                                     | - No aggregate requirements.<br>- \$20 fee.<br>- 3.3 GPA or higher.                                                                                                                                                                                                 |
| **Selection**    | Only selected if there is an open spot (this can happen through one of the executives resigning or one of them being removed), selective appointment is allowed because the open position must be filled quickly.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Interview selection then selective appointment by Co-founders with approval from the board (if deemed necessary under a timely manner).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Can be appointed directly if qualified enough and board agrees.                                                                                                                                                                                                                                                                                                                                                                                                                                           | Interview process required and the branch leader gets to choose based on merit.                                                                                                                                                                                     |

Adult Leadership in Hands of Hope
Hands of Hope is a teen-made and teen-run non-profit organization. The number of adults in leadership positions is very limited within the organization. The listed adults are the few adults with a major role in the organization.
Prabal Shah: Prabal Shah is the father of one of the co-founders of the organization. He oversees the progress and duties of the non-profit organization. Prabal Shah’s signature appears on the fiscal sponsorship document.

Nikhilkumar P. Trivedi: Nikhilkumar P. Trivedi is the father of one of the cofounders of the organization. He helps oversee the progress and duties of the nonprofit organization. Nikhilkumar P. Trivedi’s signature appears on the fiscal sponsorship document.

Melanie Smith: Melanie Smith is the primary contact for Hands of Hope. In a situation where Hands of Hope must contact Hack Club regarding anything majorly important about the organization, the primary contact will be emailed or contacted. Melanie Smith’s name and signature appear on the fiscal sponsorship document.

Sarvesh M. Kumar: Sarvesh M. Kumar is the secondary contact of Hack Club. Sarvesh is the person Hands of Hope contacts if Hands of Hope needs anything done within Hack Club or if Hands of Hope has an issue within Hack Club. Though Melanie Smith may be listed as the primary contact for Hands of Hope, the main person who should be contacted for any issue is Sarvesh M. Kumar. 

Each Branch of Hands of Hope also has a teacher sponsor for that given school so they can operate.
Liability wavier (everyone has to sign) :



Event Liability Release

By signing this event liability release (“Release”), I hereby agree and acknowledge that I have made the voluntary and informed decision to participate in the event entitled	to be conducted	 at
 	(“Event”) and organized and hosted by a group of students (the “Team”), a fiscal sponsee of The Hack Foundation, a California nonprofit corporation serving as a fiscal sponsor for events hosted by students, such as the Team (the “Nonprofit”). The Team and the Nonprofit shall be collectively referred to as “Hack Club” for purposes of this Release.

In consideration for my ability to participate in the Event, I agree to the contractual representations and agreements made herein. Further, I understand and agree that I am not required to participate in the Event and that my agreement to do so and to execute this Release has been made in my sole and unfettered discretion and not under duress or any undue influence from any individual, entity or organization.

I am aware that the activities associated with the Event, including but not limited to the travel to and from the Event, may be hazardous to my health or well-being and that I could be seriously injured or killed; however, I acknowledge that by signing this release, I, for myself and for my heirs, next of kin, executors, administrators, legal representatives, assignees and successors in interest, am assuming the risks associated with participation in the Event and that I am releasing Hack Club, and each of its officers, employees, attorneys, agents and volunteers from any and all liability for damage to or loss of my personal property, sickness or injury from any source, or death which might occur while participating in the Event. Further, I acknowledge, understand and agree that this release is a valid and binding contract and that I have read it carefully and understand and agree to be bound by the contents hereof.

In addition to the foregoing, by signing below, I hereby expressly warrant and represent that I have been made aware of, agree to and acknowledge each of the following for myself, my heirs, next of kin, executors, administrators, legal representatives, assignees and successors in interest:

 	(initial) I am over 18 years of age; my date of birth is _____.

OR

 	(initial) I am under 18 years of age and my parent or guardian who is over 18 years of age is entering into this Release on my behalf as evidenced by such parent or guardian’s signature below.
I freely and knowingly agree to voluntarily participate in the Event activities, which not only include programming, but also include a meal/snacks/food and physical activity. As such, I am participating in all Event activities at my own risk, including physical, psychological and monetary risks.
I hereby acknowledge, agree, warrant and represent that I will abide by all laws, rules, regulations and procedures of Hack Club and applicable law while participating in the Event. I further agree to act courteously at all times to any and all individuals with whom I have contact, and will not harass other participants, cause disruptions, damage the Event venue or any property, including but not limited to the property of other student participants. I agree that at any time Hack Club may revoke the permission granted to me to partake in the Event.
I hereby grant to Hack Club and Hack Club’s affiliates, and each of their directors, officers, employees, agents, successors, licensees and assigns, the worldwide, perpetual and irrevocable right to: (a) photograph or videotape me or record my voice, and to use said photography, video, sound recording or other likeness (the “Images”) in the production, distribution, promotion and advertisement of the Event or Hack Club; and (b) to use such Images in connection with the production, distribution, promotion, advertisement and exploitation of the Event or Hack Club and the charitable programs and activities associated therewith. I hereby agree and consent that Hack Club shall have the right to edit the Images as Hack Club sees fit and in its sole and unfettered discretion and that Hack Club shall have all right, title and interest in any and all results from the use of the Images. The rights herein granted to Hack Club shall include, but are not limited to, the right to use the Images to such extent and in such manner, in and in connection with said Event, as Hack Club in its sole and complete discretion may determine, and the right to distribute, exhibit To the furthest extent permissible by law, I hereby release Hack Club, and Hack Club’s officers, directors, agents, attorneys and employees, from any and all liabilities, claims, damages, costs or responsibilities associated with my participation in the Event, including but not limited to those resulting from personal injury or property damage which I may suffer while participating in the Event (or travel related thereto), including but not limited to injury or damage caused by my intentional acts, negligence (gross or otherwise), or willful or wanton conduct or the intentional acts, negligence (gross or otherwise), or willful or wanton conduct of third parties.
I agree and acknowledge that Hack Club shall have no responsibility or liability whatsoever for any of my acts, omissions or failures to act during my participation in the Event, including but not limited to my negligence, intentional acts, gross negligence, or willful or wanton conduct. Further, I hereby agree to indemnify and release Hack Club and its officers, directors, agents and employees from any and all liabilities, claims, damages, costs (including but not limited to attorney’s fees) resulting from any of my acts, omissions or failures to act during my participation in the Event, including but not limited to my negligence, intentional acts, gross negligence, or willful or wanton conduct.
I agree and acknowledge that the validity, interpretation and enforcement of this document and any dispute arising out of my participation in the Event, whether in contract, tort, equity, or otherwise, will be governed by the laws of the state of California. I hereby agree that if any provision of this Release or any portion thereof, is held by a court of competent jurisdiction to be invalid, void, or unenforceable, the remainder of this document shall nevertheless remain in full force and effect, and such provision shall be deemed deleted from this Release and replaced with a valid and enforceable provision which so far as possible achieves the parties’ intent in agreeing to the original provision. I agree that this Release may be executed in any number of counterparts and by email, facsimile transmission or any other form of electronic or digital signature, each of which shall be deemed an original, but all of which when taken together shall constitute one and the same instrument. I agree that this Release constitutes the sole understanding of the parties about this subject matter and may not be amended or modified except in writing signed by each of the parties to this Release.
I HAVE BEEN GIVEN A COPY OF THIS RELEASE FOR MY PERSONAL RECORDS AND THIS INFORMATION WAS PROVIDED TO ME IN A LANGUAGE I CAN READ AND UNDERSTAND. BY SIGNING BELOW, I HEREBY ACKNOWLEDGE THAT I HAVE READ AND UNDERSTOOD THE ABOVE DISCLOSURES AND REPRESENTATIONS AND AGREE TO AND ACKNOWLEDGE THE INFORMATION PROVIDED HEREIN.


(Print Name)	(Date)


(Signature)	(Address)

(City, State, Zip)

(Phone Number & Email Address)
[For minors under the age of 18 years, parent or guardian must sign]


Parent or Guardian (Print Name)	(Date)


(Signature)	(Phone Number & Email Address)


Do you agree to allow your child to have unsupervised free time during _____________ [Date] between the non-curfew hours of [allowed timings] ? (YES / NO): ______ 

If YES, students will be allowed to leave the venue unsupervised during non-curfew hours, ie the day. If NO, your child will still be able to participate in all scheduled activities, however, they will be denied permission to leave the venue unsupervised.

`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if API key is available
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Initialize Gemini AI
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `${HANDS_OF_HOPE_CONTEXT}

User Question: ${message}

Please provide a helpful, informative response about Hands of Hope based on the user's question. Keep your response conversational and encouraging.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({
      response: response.text || "I'm here to help with information about Hands of Hope! How can I assist you today?"
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
} 