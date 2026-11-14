import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

pdf_path = r"D:\codesprint\Snap2Solve_Pitch_Script.pdf"
doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    rightMargin=36,
    leftMargin=36,
    topMargin=36,
    bottomMargin=36
)

styles = getSampleStyleSheet()

# Colors
C_RED = colors.HexColor("#E31E2D")
C_DARK = colors.HexColor("#141414")
C_CHARCOAL = colors.HexColor("#2B2F36")
C_MUTED = colors.HexColor("#5C5C5C")
C_WARM_BG = colors.HexColor("#FAF8F5")
C_BORDER = colors.HexColor("#CFCAC6")
C_GREEN = colors.HexColor("#2F7D4F")

# Custom Styles
title_style = ParagraphStyle(
    "DocTitle",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=20,
    leading=24,
    textColor=C_DARK,
    spaceAfter=4
)

subtitle_style = ParagraphStyle(
    "DocSubtitle",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=10,
    leading=14,
    textColor=C_MUTED,
    spaceAfter=12
)

act_header_style = ParagraphStyle(
    "ActHeader",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=13,
    leading=17,
    textColor=C_RED,
    spaceBefore=10,
    spaceAfter=4
)

action_style = ParagraphStyle(
    "ActionCue",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=9,
    leading=13,
    textColor=C_CHARCOAL,
    backColor=colors.HexColor("#EAE7E4"),
    borderPadding=4,
    spaceAfter=6
)

speech_style = ParagraphStyle(
    "Speech",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=9.5,
    leading=14,
    textColor=C_DARK,
    spaceAfter=8
)

tip_style = ParagraphStyle(
    "TipStyle",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.5,
    leading=12,
    textColor=C_CHARCOAL
)

story = []

# Header Banner
story.append(Paragraph("<b>SNAP2SOLVE — 3.5 MINUTE LIVE HACKATHON PITCH SCRIPT</b>", title_style))
story.append(Paragraph("<b>Team Tech Astra</b> · ABES Engineering College | <i>Tagline: 'Snap it. Report it. Fix it.'</i> | Live Demo: <b>http://localhost:3000</b>", subtitle_style))
story.append(HRFlowable(width="100%", thickness=2, color=C_DARK, spaceAfter=10))

# Overview Table
summary_data = [
    [
        Paragraph("<b>0:00 - 0:45</b><br/>The Hook & Problem<br/><i>Home Screen (/)</i>", tip_style),
        Paragraph("<b>0:45 - 1:45</b><br/>3-Step Snap & Draft<br/><i>Report Flow (/report)</i>", tip_style),
        Paragraph("<b>1:45 - 2:30</b><br/>Public Map & Co-Sign<br/><i>Interactive Map (/map)</i>", tip_style),
        Paragraph("<b>2:30 - 3:00</b><br/>14-Day Escalation & RTI<br/><i>Dossier (/c/[id])</i>", tip_style),
        Paragraph("<b>3:00 - 3:30</b><br/>Ward Scorecard & Close<br/><i>Wards (/wards)</i>", tip_style),
    ]
]
t_summary = Table(summary_data, colWidths=[108, 108, 108, 108, 108])
t_summary.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), C_WARM_BG),
    ('BOX', (0,0), (-1,-1), 1, C_DARK),
    ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
]))
story.append(t_summary)
story.append(Spacer(1, 10))

# ACT 1
story.append(Paragraph("ACT 1: THE HOOK & THE BROKEN SYSTEM [0:00 - 0:45]", act_header_style))
story.append(Paragraph("<b>SCREEN CUE:</b> Open on Homepage (http://localhost:3000). Show top emergency banner and live counter strip.", action_style))
speech_1 = (
    "\"Respected judges and fellow builders, good morning.<br/><br/>"
    "Hum sabne apni colony mein ek hi sadak par 6 mahine se khula kachra ya janleva pothole dekha hai. "
    "Hum Nagar Nigam ke generic portal ya app par complaint daalte hain... aur fir wo complaint ek digital black hole mein gayab ho jaati hai.<br/><br/>"
    "Kyun? Because existing apps are just suggestion boxes. Unke paas koi <b>legal accountability</b> nahi hai, "
    "koi <b>statutory deadline</b> nahi hai, aur na hi koi public verification.<br/><br/>"
    "Today, Team Tech Astra from ABES Engineering College presents <b>Snap2Solve</b> — a civic-tech platform built on a simple philosophy: "
    "<b>'Snap it. Report it. Fix it.'</b> Hum har aam nagrik ke smartphone camera ko municipal officers ke khilaf ek legally-binding leverage bana rahe hain.\""
)
story.append(Paragraph(speech_1, speech_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=8))

# ACT 2
story.append(Paragraph("ACT 2: THE 3-STEP SNAP & MUNICIPAL NOTICE DRAFT [0:45 - 1:45]", act_header_style))
story.append(Paragraph("<b>ACTION CUE:</b> Click big red button 'Photo kheencho / Snap a photo' -> on /report, click preset 'Garbage Dump (Indirapuram)'.", action_style))
speech_2 = (
    "\"Let me show you how a citizen experiences this on the ground.<br/><br/>"
    "Suppose main Indirapuram ke Shakti Khand 2 market mein khada hoon, jahan sadak par ek bada kachre ka dher laga hai.<br/>"
    "<i>[Click on preset 'Garbage Dump (Indirapuram)']</i><br/><br/>"
    "Notice what happened in 1 second:<br/>"
    "1. Phone ke GPS se exact coordinates <b>(28.6418 N, 77.3715 E)</b> capture hue aur isne auto-map kiya ki yeh <b>Ward 14, Zone 3</b> hai.<br/>"
    "2. Hamare AI Vision model ne image scan karke 94% confidence ke saath issue classify kiya aur isse <b>Solid Waste Management Rules 2016</b> ke Rule 15 se tag kiya.<br/><br/>"
    "<i>[Scroll and click 'Draft Formal Complaint Notice']</i><br/><br/>"
    "Yahan aati hai hamari core innovation: <b>The Municipal Notice Engine</b>.<br/>"
    "Yeh koi casual complaint nahi hai. This is a formal administrative notice addressed directly to the Zonal Officer, Nagar Nigam Ghaziabad.<br/>"
    "<i>[Click 'हिंदी' toggle button]</i> -> Dekhiye, ek click mein poora notice statutory Hindi shabdon mein tabdeel ho gaya.<br/>"
    "Citizen can immediately dispatch this via WhatsApp directly to the zonal control room or via official email.<br/><br/>"
    "<i>[Click big red button 'Submit & Start 7-Day Clock']</i><br/><br/>"
    "And look at the stamp that landed: <b>'RECEIVED & 7-DAY CLOCK STARTED'</b>.<br/>"
    "Permanent ID <b>S2S-GZB-004217</b> generate hui aur strict 7-day target lock ho gaya: 22 November tak kaam hona hi hoga.\""
)
story.append(Paragraph(speech_2, speech_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=8))

# ACT 3
story.append(Paragraph("ACT 3: PUBLIC MAP & NEIGHBORHOOD CITIZEN PRESSURE [1:45 - 2:30]", act_header_style))
story.append(Paragraph("<b>ACTION CUE:</b> Click 'View on Public Map' (or /map in top nav). Click the red pin at Shakti Khand Indirapuram to open side drawer.", action_style))
speech_3 = (
    "\"Ab sawaal yeh hai: complaint submit hone ke baad officer isse ignore kyun nahi karega?<br/><br/>"
    "Because of this: <b>The Public Transparency Layer</b>.<br/>"
    "Yeh Ghaziabad ka live map hai running on Leaflet + OpenStreetMap without any paid API keys:<br/>"
    "- <b>Red Pins:</b> Jo 7-day limit breach karke escalate ho chuki hain.<br/>"
    "- <b>Amber Pins:</b> Jinka 7-day clock abhi active hai.<br/>"
    "- <b>Green Pins:</b> Jo successfully resolve aur verify ho chuki hain.<br/><br/>"
    "<i>[Tap on Shakti Khand Red Marker]</i><br/>"
    "Notice this counter: <b>'Reported by 42 citizens'</b>.<br/>"
    "Jab ek hi kachre ke dher ko mohalle ke 42 log flag karte hain, Snap2Solve duplicate ticket banane ke bajaye us complaint ka <b>legal weight multiply</b> kar deta hai. Ab officer yeh nahi bol sakta ki 'humein kisi ne bataya nahi'.\""
)
story.append(Paragraph(speech_3, speech_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=8))

# ACT 4
story.append(Paragraph("ACT 4: 14-DAY ESCALATION LADDER, RTI & COMMUNITY AUDIT [2:30 - 3:00]", act_header_style))
story.append(Paragraph("<b>ACTION CUE:</b> In the side drawer, click 'View Full Letter & Timeline' -> opens /c/S2S-GZB-004217.", action_style))
speech_4 = (
    "\"Here is the heart of statutory accountability: <b>The 14-Day Escalation Ladder</b>.<br/>"
    "- <b>Day 0:</b> Notice dispatched to Zonal Officer & Junior Engineer.<br/>"
    "- <b>Day 3:</b> Automated digital ping to the JE.<br/>"
    "- <b>Day 7:</b> Agar kaam nahi hua, Red Alert! Ticket automatically escalates to the <b>Municipal Commissioner</b>.<br/>"
    "- <b>Day 14:</b> Snap2Solve generates a ready <b>Section 6(1) UP RTI Application</b> asking for contractor contract details and responsible engineers' names.<br/><br/>"
    "<i>[Scroll to 'Before / After Check']</i><br/>"
    "Aur sabse zaroori baat: Nagar Nigam ka babu akela claim karke ticket close nahi kar sakta.<br/>"
    "Fix tabhi mana jayega jab nearby citizens zameen par jaakar verify karein. Agar kaam theek se nahi hua, any citizen can click <b>'Still Broken / टूटा है'</b>, aur ticket dobara Red Escalated state mein khul jaata hai.\""
)
story.append(Paragraph(speech_4, speech_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=8))

# ACT 5
story.append(Paragraph("ACT 5: WARD SCORECARD, OPEN DATA & GRAND CLOSE [3:00 - 3:30]", act_header_style))
story.append(Paragraph("<b>ACTION CUE:</b> Click 'Ward Scorecard' (/wards) -> then click 'Open Data' (/open).", action_style))
speech_5 = (
    "\"To complete the democratic accountability, we built the <b>Ward Report Card</b>.<br/>"
    "Yahan real data hai: <b>Ward 09 Kavi Nagar</b> earns an <b>A+ Grade</b> with 91% solve rate and 2.5 days average fix time. "
    "Jabki <b>Ward 03 Sahibabad Site 4</b> gets an <b>F Grade</b> with 9.6 days delay.<br/><br/>"
    "<i>[Click 'Open Data' (/open)]</i><br/>"
    "Snap2Solve is <b>100% open source under MIT License</b>. Kisi bhi naye shahar jaise Lucknow, Noida ya Kanpur ko add karne ke liye developer ko sirf ek simple JSON schema file pull request mein bhejni hoti hai.<br/><br/>"
    "Tech Stack: Next.js App Router, Tailwind CSS, Leaflet, and a modular /lib/api.ts layer that connects directly to a FastAPI computer vision service.<br/><br/>"
    "<b>Team Tech Astra, ABES Engineering College.<br/>"
    "Snap it. Report it. Fix it. Thank you!</b>\""
)
story.append(Paragraph(speech_5, speech_style))
story.append(Spacer(1, 8))

# Judges Q&A Cheat Sheet Box
qa_header = Paragraph("<b>⚡ JUDGES Q&A CHEAT SHEET (TIPS FOR PRESENTERS)</b>", ParagraphStyle("QAHead", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=10, textColor=colors.white))
q1 = Paragraph("<b>Q: Is this legally enforceable?</b><br/>A: Yes. All notices directly cite sections of the UP Municipal Corporation Act 1959 and Solid Waste Management Rules 2016, with an automated UP RTI Section 6(1) docket ready at Day 14.", tip_style)
q2 = Paragraph("<b>Q: How do you prevent fake complaints?</b><br/>A: Live GPS coordinate verification, AI vision image match, and required community before/after multi-user confirmation before any ticket is marked resolved.", tip_style)
q3 = Paragraph("<b>Q: How does it scale to other cities?</b><br/>A: Authority contacts, bylaws and ward boundaries are completely decoupled into JSON schemas under /open. Adding a new city requires zero code changes.", tip_style)

qa_table = Table([
    [qa_header],
    [q1],
    [q2],
    [q3]
], colWidths=[540])
qa_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), C_DARK),
    ('BACKGROUND', (0,1), (-1,-1), C_WARM_BG),
    ('BOX', (0,0), (-1,-1), 1, C_DARK),
    ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
]))
story.append(qa_table)

doc.build(story)
print("PDF successfully generated at:", pdf_path)
