import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.incident.deleteMany();
  await prisma.session.deleteMany();
  await prisma.caseTimelineEvent.deleteMany();
  await prisma.case.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.student.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Firefly@123", 10);

  const [admin, counsellor, teacher, parentUser, studentUser] = await Promise.all([
    prisma.user.create({
      data: {
        fullName: "Aarav Mehta",
        email: "admin@firefly.local",
        role: "ADMIN",
        passwordHash,
        schoolId: "school-001"
      }
    }),
    prisma.user.create({
      data: {
        fullName: "Priya Sharma",
        email: "counsellor@firefly.local",
        role: "COUNSELLOR",
        passwordHash,
        schoolId: "school-001"
      }
    }),
    prisma.user.create({
      data: {
        fullName: "Rajesh Kumar",
        email: "teacher@firefly.local",
        role: "TEACHER",
        passwordHash,
        schoolId: "school-001"
      }
    }),
    prisma.user.create({
      data: {
        fullName: "Anita Desai",
        email: "parent@firefly.local",
        role: "PARENT",
        passwordHash,
        schoolId: "school-001"
      }
    }),
    prisma.user.create({
      data: {
        fullName: "Arjun Patel",
        email: "student@firefly.local",
        role: "STUDENT",
        passwordHash,
        schoolId: "school-001"
      }
    })
  ]);

  const students = await Promise.all([
    prisma.student.create({
      data: {
        admissionNumber: "FF-2024-001",
        firstName: "Arjun",
        lastName: "Patel",
        grade: "8",
        classroom: "8A",
        tier: "TIER_3",
        status: "NEEDS_INTERVENTION",
        riskScore: 84,
        counsellorId: counsellor.id
      }
    }),
    prisma.student.create({
      data: {
        admissionNumber: "FF-2024-002",
        firstName: "Priya",
        lastName: "Sharma",
        grade: "10",
        classroom: "10B",
        tier: "TIER_2",
        status: "NEEDS_SUPPORT",
        riskScore: 62,
        counsellorId: counsellor.id
      }
    }),
    prisma.student.create({
      data: {
        admissionNumber: "FF-2024-003",
        firstName: "Rohan",
        lastName: "Verma",
        grade: "7",
        classroom: "7A",
        tier: "TIER_2",
        status: "NEEDS_SUPPORT",
        riskScore: 55,
        counsellorId: counsellor.id
      }
    }),
    prisma.student.create({
      data: {
        admissionNumber: "FF-2024-004",
        firstName: "Ananya",
        lastName: "Reddy",
        grade: "9",
        classroom: "9C",
        tier: "TIER_3",
        status: "NEEDS_INTERVENTION",
        riskScore: 91,
        counsellorId: counsellor.id
      }
    }),
    prisma.student.create({
      data: {
        admissionNumber: "FF-2024-005",
        firstName: "Vikram",
        lastName: "Singh",
        grade: "6",
        classroom: "6B",
        tier: "TIER_2",
        status: "NEEDS_SUPPORT",
        riskScore: 48,
        counsellorId: counsellor.id
      }
    })
  ]);

  const [arjun, priya, rohan, ananya, vikram] = students;

  await prisma.assessment.createMany({
    data: [
      { studentId: arjun.id, score: 58, riskLevel: "MEDIUM", notes: "Moderate stress indicators - academic pressure" },
      { studentId: arjun.id, score: 62, riskLevel: "HIGH", notes: "Increased absenteeism, declining check-in scores" },
      { studentId: arjun.id, score: 84, riskLevel: "HIGH", notes: "Self-harm indicators detected in journal" },
      { studentId: ananya.id, score: 78, riskLevel: "HIGH", notes: "Recent crisis incident reported" },
      { studentId: ananya.id, score: 84, riskLevel: "CRITICAL", notes: "Immediate intervention needed - suicidal ideation" },
      { studentId: priya.id, score: 48, riskLevel: "MEDIUM", notes: "Anxiety affecting academic performance" },
      { studentId: vikram.id, score: 32, riskLevel: "LOW", notes: "Mild behavioural concerns" },
      { studentId: rohan.id, score: 55, riskLevel: "MEDIUM", notes: "Peer relationship difficulties" }
    ]
  });

  const crisisCase = await prisma.case.create({
    data: {
      studentId: ananya.id,
      openedById: admin.id,
      assignedCounsellorId: counsellor.id,
      title: "Crisis intervention and safety planning - Ananya Reddy",
      summary: "Escalated risk from repeated distress signals and crisis incident report. Self-harm ideation detected.",
      tier: "TIER_3",
      type: "CRISIS",
      riskLevel: "CRITICAL",
      status: "IN_PROGRESS",
      timelineEvents: {
        create: [
          {
            createdById: counsellor.id,
            eventType: "case_opened",
            title: "Case Opened - Crisis Protocol",
            description: "Case created after high-risk screening and teacher referral. Immediate intervention required."
          },
          {
            createdById: counsellor.id,
            eventType: "parent_contacted",
            title: "Parent Contacted",
            description: "Parents notified and consent for crisis intervention documented. Safety plan discussed."
          },
          {
            createdById: counsellor.id,
            eventType: "risk_assessment",
            title: "Risk Assessment Completed",
            description: "Comprehensive risk assessment completed. Score: 91/100 - CRITICAL. 24/7 monitoring initiated."
          }
        ]
      }
    }
  });

  const arjunCase = await prisma.case.create({
    data: {
      studentId: arjun.id,
      openedById: admin.id,
      assignedCounsellorId: counsellor.id,
      title: "Self-harm concern monitoring - Arjun Patel",
      summary: "Teacher reported concerning statements in student journal. Self-harm indicators detected.",
      tier: "TIER_3",
      type: "COUNSELLING",
      riskLevel: "HIGH",
      status: "IN_PROGRESS",
      timelineEvents: {
        create: [
          {
            createdById: teacher.id,
            eventType: "concern_reported",
            title: "Teacher Concern Reported",
            description: "Rajesh Kumar reported concerning statements found in Arjun's journal during class."
          },
          {
            createdById: counsellor.id,
            eventType: "assessment_scheduled",
            title: "Counsellor Assessment Scheduled",
            description: "Initial assessment scheduled with Priya Sharma. Parent meeting arranged."
          }
        ]
      }
    }
  });

  await prisma.session.createMany({
    data: [
      {
        caseId: crisisCase.id,
        studentId: ananya.id,
        counsellorId: counsellor.id,
        title: "Initial crisis counseling - Ananya Reddy",
        notes: "Introduced coping strategies and emergency contacts. Student responsive but emotionally fragile. 24/7 helpline provided.",
        scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        durationMins: 60,
        status: "COMPLETED"
      },
      {
        caseId: crisisCase.id,
        studentId: ananya.id,
        counsellorId: counsellor.id,
        title: "Follow-up safety review - Ananya Reddy",
        notes: "Monitor emotional state and reinforce school support plan. Parent feedback positive.",
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        durationMins: 45,
        status: "SCHEDULED"
      },
      {
        caseId: arjunCase.id,
        studentId: arjun.id,
        counsellorId: counsellor.id,
        title: "Initial assessment - Arjun Patel",
        notes: "Student showed willingness to engage. Discussed triggers and coping mechanisms. Risk level: HIGH.",
        scheduledAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        durationMins: 50,
        status: "COMPLETED"
      },
      {
        studentId: priya.id,
        counsellorId: counsellor.id,
        title: "Anxiety management session - Priya Sharma",
        notes: "Introduced breathing techniques and progressive muscle relaxation. Homework: daily mood tracking.",
        scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        durationMins: 45,
        status: "COMPLETED"
      }
    ]
  });

  await prisma.incident.create({
    data: {
      studentId: ananya.id,
      caseId: crisisCase.id,
      reportedById: teacher.id,
      severity: "CRITICAL",
      incidentType: "Self-harm ideation",
      description: "Student expressed suicidal thoughts during morning check-in questionnaire. Immediate crisis protocol activated per SC V guidelines.",
      actionTaken: "Crisis team notified within 5 minutes. Parents contacted immediately. Safety plan initiated. Student escorted to counsellor's office. 24/7 helpline provided."
    }
  });

  await prisma.incident.create({
    data: {
      studentId: arjun.id,
      caseId: arjunCase.id,
      reportedById: teacher.id,
      severity: "HIGH",
      incidentType: "Self-harm concern",
      description: "Teacher reported concerning statements and self-harm indicators found in student journal during class.",
      actionTaken: "Counsellor assessment scheduled for next day. Parent meeting arranged. Increased monitoring frequency."
    }
  });

  console.log("Seed complete with Indian names:");
  console.log("admin@firefly.local / Firefly@123 (Aarav Mehta)");
  console.log("counsellor@firefly.local / Firefly@123 (Priya Sharma)");
  console.log("teacher@firefly.local / Firefly@123 (Rajesh Kumar)");
  console.log("parent@firefly.local / Firefly@123 (Anita Desai)");
  console.log("student@firefly.local / Firefly@123 (Arjun Patel)");
  console.log("\nStudents seeded: Arjun Patel, Priya Sharma, Rohan Verma, Ananya Reddy, Vikram Singh");
  console.log("Cases: Crisis case (Ananya), Self-harm monitoring (Arjun)");
  console.log("Assessments: 8 records, Sessions: 4 records, Incidents: 2 records");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });