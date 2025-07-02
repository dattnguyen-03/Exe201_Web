import React from "react";
import "./index.css";

export default function Main() {
  return (
    <div className="main-container flex w-[1242px] gap-[50px] items-start flex-nowrap bg-[rgba(25,25,25,0)] relative mx-auto my-0">
      <div className="w-[596px] h-[842px] shrink-0 bg-[#fff] relative overflow-hidden">
        <div className="h-[842px] bg-[#fff] absolute top-0 left-0 right-0 overflow-hidden z-[1]">
          <div className="w-[595.5px] h-[842.25px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-07-02/Eec4pEUg9E.png)] bg-cover bg-no-repeat absolute top-0 left-0 z-[2]" />
          <div className="w-[473px] h-[23px] font-['Inter'] text-[11px] font-normal leading-[13.313px] absolute top-[74.44px] left-[72.71px] text-left z-[11]">
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.313px] text-[#000] tracking-[0.01px] relative text-left">
              Design a smart child monitoring web application with a login
              system and two separate user
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.503px] text-[#000] relative text-left">
              roles: Parent and School Administrator.
            </span>
          </div>
          <div className="w-[322px] h-[186px] font-['Inter'] text-[11px] font-normal leading-[13.313px] absolute top-[116.17px] left-[72px] text-left z-10">
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.313px] text-[#000] relative text-left">
              Include the following screens and features:
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[29.123px] text-[#000] relative text-left">
              🔐 0. Login Page
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.429px] text-[#000] relative text-left">
              - Input: Email & Password
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.943px] text-[#000] relative text-left">
              - Role selection after login: Parent or School Admin
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.842px] text-[#000] relative text-left">
              - Forgot password link
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[21.279px] text-[#000] relative text-left">
              {" "}
              Parent Dashboard:
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[38.139px] text-[#000] relative text-left">
              1 . Parent Home (Dashboard Overview)
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.977px] text-[#000] relative text-left">
              - Show real-time status of their child: location, current activity
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.866px] text-[#000] relative text-left">
              - Latest alerts: climbing, leaving safe zone, collisions
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.876px] text-[#000] relative text-left">
              - Camera and AI status: active, disconnected, recordin
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.313px] text-[#000] relative text-left">
              g
            </span>
          </div>
          <div className="w-[281px] h-[54px] font-['Inter'] text-[11px] font-normal leading-[13.313px] absolute top-[321.7px] left-[72.33px] text-left whitespace-nowrap z-[9]">
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.313px] text-[#000] relative text-left">
              2. Live View
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[16.273px] text-[#000] relative text-left">
              - View classroom or monitoring area in real-time
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.042px] text-[#000] tracking-[0.01px] relative text-left">
              - Switch between single child view and full-class view
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.2px] text-[#000] relative text-left">
              - AI overlay: highlight child and danger zones
            </span>
          </div>
          <div className="w-[356px] h-[54px] font-['Inter'] text-[11px] font-normal leading-[13.313px] absolute top-[394.32px] left-[72.35px] text-left whitespace-nowrap z-[8]">
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.313px] text-[#000] relative text-left">
              3. Alerts Center
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.892px] text-[#000] tracking-[0.01px] relative text-left">
              - List of recent alerts with time, location, behavior type,
              image/video
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.775px] text-[#000] relative text-left">
              - Allow parent to confirm (true/false) and add notes
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.846px] text-[#000] relative text-left">
              - Filters by type, date, child, and class
            </span>
          </div>
          <div className="w-[313px] h-[51px] font-['Inter'] text-[11px] font-normal leading-[13.313px] absolute top-[467.19px] left-[72.14px] text-left z-[7]">
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.313px] text-[#000] relative text-left">
              4. Behavior Reports
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.839px] text-[#000] relative text-left">
              - Child activity charts (day, week, month)
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.951px] text-[#000] tracking-[0.01px] relative text-left">
              - Behavior profile: frequent wandering, climbing, low activity
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.691px] text-[#000] relative text-left">
              - Risk trend visualization
            </span>
          </div>
          <div className="w-[296px] h-[40px] font-['Inter'] text-[11px] font-normal leading-[13.313px] absolute top-[539.92px] left-[72.35px] text-left whitespace-nowrap z-[6]">
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.313px] text-[#000] relative text-left">
              5. Danger Zone Map
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.749px] text-[#000] relative text-left">
              - Interactive classroom map with red zones marked by AI
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.755px] text-[#000] relative text-left">
              - Auto-updates over time based on AI learning
            </span>
          </div>
          <div className="w-[237px] h-[54px] font-['Inter'] text-[11px] font-normal leading-[13.313px] absolute top-[597.97px] left-[72.35px] text-left whitespace-nowrap z-[5]">
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.313px] text-[#000] relative text-left">
              6. Child Profile & Facial Recognition
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.189px] text-[#000] relative text-left">
              - Show child info: photo, name, class, contact
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[16.228px] text-[#000] relative text-left">
              - Alert history and behavior summary
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.101px] text-[#000] relative text-left">
              - Update facial recognition data
            </span>
          </div>
          <div className="w-[346px] h-[69px] font-['Inter'] text-[11px] font-normal leading-[13.313px] absolute top-[670.71px] left-[72.35px] text-left whitespace-nowrap z-[4]">
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.313px] text-[#000] relative text-left">
              7. Account & Permissions
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[16.014px] text-[#000] relative text-left">
              - Parents can only access their own child
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.737px] text-[#000] relative text-left">
              - Teachers can access their class
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.973px] text-[#000] relative text-left">
              - Admin can access the whole system
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.789px] text-[#000] relative text-left">
              - Customize alert preferences (e.g., parents get only critical
              alerts)
            </span>
          </div>
          <span className="flex h-[8px] justify-start items-center font-['Inter'] text-[11px] font-normal leading-[8px] text-[#000] absolute top-[757.742px] left-[72px] text-left whitespace-nowrap z-[3]">
            8. Notifications & Chat
          </span>
        </div>
      </div>
      <div className="w-[596px] h-[842px] shrink-0 bg-[#fff] relative overflow-hidden z-[12]">
        <div className="h-[842px] bg-[#fff] absolute top-0 left-0 right-0 overflow-hidden z-[13]">
          <div className="w-[595.5px] h-[842.25px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-07-02/uXjuRmdF00.png)] bg-cover bg-no-repeat absolute top-0 left-0 z-[14]" />
          <div className="w-[255px] h-[38px] font-['Inter'] text-[11px] font-normal leading-[13.313px] absolute top-[74.3px] left-[72.35px] text-left z-[24]">
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.313px] text-[#000] relative text-left">
              - Send alerts via app/email/SMS
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.373px] text-[#000] relative text-left">
              - Parent can respond to alerts or contact teacher
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.138px] text-[#000] relative text-left">
              - Chat feature for clarifications
            </span>
          </div>
          <div className="w-[149px] h-[8px] font-['Inter'] text-[11px] font-normal bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-07-02/FdZ6BVFCOA.png)] bg-cover bg-no-repeat leading-[8px] absolute top-[132.253px] left-[72px] z-[23]" />
          <div className="w-[265px] h-[69px] font-['Inter'] text-[11px] font-normal leading-[13.313px] absolute top-[161.58px] left-[72.35px] text-left whitespace-nowrap z-[22]">
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.313px] text-[#000] relative text-left">
              1 . Admin Home (Overview)
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.734px] text-[#000] tracking-[0.01px] relative text-left">
              - Total number of children, classes, active cameras
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.587px] text-[#000] relative text-left">
              - Latest alerts system-wide
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.124px] text-[#000] relative text-left">
              - Alert statistics by class and behavior type
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.057px] text-[#000] relative text-left">
              - Camera and AI system health
            </span>
          </div>
          <div className="w-[296px] h-[69px] font-['Inter'] text-[11px] font-normal leading-[13.313px] absolute top-[248.86px] left-[72.33px] text-left whitespace-nowrap z-[21]">
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.313px] text-[#000] relative text-left">
              2. Class & Student Management
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.741px] text-[#000] relative text-left">
              - List of all classes, number of students
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.595px] text-[#000] tracking-[0.01px] relative text-left">
              - Manage student profiles: name, photo, class, birth date
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.984px] text-[#000] relative text-left">
              - View each child’s behavior profile
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.188px] text-[#000] relative text-left">
              - Attach/update facial recognition data
            </span>
          </div>
          <div className="w-[288px] h-[53px] font-['Inter'] text-[11px] font-normal leading-[13.313px] absolute top-[336.15px] left-[72.35px] text-left z-20">
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.313px] text-[#000] relative text-left">
              3. Teacher & Parent Account Management
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.088px] text-[#000] relative text-left">
              - List of all teacher/parent accounts
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.244px] text-[#000] relative text-left">
              - Role-based permissions: who can see what
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[16.151px] text-[#000] tracking-[0.01px] relative text-left">
              - Send messages or alerts to individual/group accounts
            </span>
          </div>
          <div className="w-[290px] h-[69px] font-['Inter'] text-[11px] font-normal leading-[13.313px] absolute top-[408.87px] left-[72.14px] text-left whitespace-nowrap z-[19]">
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.313px] text-[#000] relative text-left">
              4. System Reports & Analysis
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.129px] text-[#000] relative text-left">
              - Generate reports by class, student, or behavior
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.152px] text-[#000] relative text-left">
              - Example: Class A had 15 “out of zone” alerts last week
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[16.045px] text-[#000] relative text-left">
              - Compare behavior trends across classes
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.197px] text-[#000] relative text-left">
              - Export reports by week/month
            </span>
          </div>
          <div className="w-[309px] h-[54px] font-['Inter'] text-[11px] font-normal leading-[13.313px] absolute top-[496.15px] left-[72.35px] text-left whitespace-nowrap z-[18]">
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.313px] text-[#000] relative text-left">
              5. Camera Playback & Event Extraction
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.153px] text-[#000] relative text-left">
              - Review past footage by time and zone
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.143px] text-[#000] relative text-left">
              - Extract clips related to alerts (e.g., climbing, pushing)
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.221px] text-[#000] relative text-left">
              - Display AI overlays with child highlights and danger zones
            </span>
          </div>
          <div className="w-[249px] h-[53px] font-['Inter'] text-[11px] font-normal leading-[13.313px] absolute top-[568.88px] left-[72.35px] text-left z-[17]">
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.313px] text-[#000] relative text-left">
              6. Alerts Center
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.907px] text-[#000] relative text-left">
              - System-wide alert list
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.865px] text-[#000] relative text-left">
              - Filter by class, behavior, severity
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[14.727px] text-[#000] tracking-[0.01px] relative text-left">
              - Confirm, categorize, or mark alerts as handled
            </span>
          </div>
          <div className="w-[254px] h-[54px] font-['Inter'] text-[11px] font-normal leading-[13.313px] absolute top-[641.75px] left-[72.35px] text-left whitespace-nowrap z-[16]">
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.313px] text-[#000] relative text-left">
              7. Danger Zone Manager
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.215px] text-[#000] relative text-left">
              - Full school layout with editable danger zones
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.221px] text-[#000] relative text-left">
              - Manually edit areas like stairs, exits, bathrooms
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.074px] text-[#000] relative text-left">
              - Enable/disable alerts per zone
            </span>
          </div>
          <div className="w-[382px] h-[53px] font-['Inter'] text-[11px] font-normal leading-[13.313px] absolute top-[714.34px] left-[72.35px] text-left z-[15]">
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.313px] text-[#000] relative text-left">
              8. Communication Center
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.907px] text-[#000] relative text-left">
              - Send emergency alerts to all parents
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[13.889px] text-[#000] relative text-left">
              - Send regular updates: weekly reports, tuition reminders,
              schedules
              <br />
            </span>
            <span className="font-['Inter'] text-[11px] font-normal leading-[15.689px] text-[#000] relative text-left">
              - Send personalized messages to parents of children with repeated
              alerts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
