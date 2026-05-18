import { motion } from "motion/react";
import { 
  FileText, 
  Download, 
  Send, 
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { useProject } from "@/context/ProjectContext";
import { Link } from "react-router-dom";

export default function ReportsPage() {
  const { visionResults, riskResults } = useProject();

  if (!visionResults && !riskResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Activity className="w-10 h-10 text-primary animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Reporting Vault Empty</h2>
          <p className="text-foreground/40 max-w-sm mx-auto">Upload project data to generate AI-certified audit reports and safety archives.</p>
        </div>
        <Link to="/upload">
          <Button size="lg" className="rounded-full px-10 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest">
            Go to Upload Center
          </Button>
        </Link>
      </div>
    );
  }

  const generatePDF = (reportName: string) => {
    const doc = new jsPDF();
    
    // Cyber style header
    doc.setFillColor(255, 140, 0);
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("SITEWATCH AI AUDIT", 15, 25);
    
    doc.setFontSize(10);
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, 15, 35);
    doc.text(`REF: ${Math.random().toString(36).substring(7).toUpperCase()}`, 160, 35);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(reportName, 15, 60);

    doc.setFontSize(12);
    doc.text("EXECUTIVE AI SUMMARY", 15, 80);
    doc.setFont("helvetica", "normal");
    const summaryLines = doc.splitTextToSize(visionResults?.summary || "Project performance tracking via real-time vision and schedule analysis. No critical blockers detected at initialization.", 180);
    doc.text(summaryLines, 15, 90);
    
    doc.setFont("helvetica", "bold");
    doc.text("CRITICAL FINDINGS", 15, 120);
    doc.setFont("helvetica", "normal");
    let yPos = 130;
    if (visionResults?.violations && visionResults.violations.length > 0) {
      visionResults.violations.forEach((v, idx) => {
        doc.text(`- ${v.type} (${v.severity}): ${v.recommendation}`, 15, yPos);
        yPos += 10;
      });
    } else {
      doc.text("- No immediate safety violations observed in current visual cache.", 15, yPos);
      yPos += 10;
    }

    doc.setFont("helvetica", "bold");
    doc.text("PREDICTIVE ANALYSIS", 15, yPos + 10);
    doc.setFont("helvetica", "normal");
    doc.text(`- Delay Probability: ${riskResults?.delay_probability || 0}%`, 15, yPos + 20);
    doc.text(`- Projected Drift: +${riskResults?.days_behind_schedule || 0} Days`, 15, yPos + 30);

    doc.save(`${reportName.toLowerCase().replace(/ /g, "_")}.pdf`);
    toast.success("PDF Downloaded Successfully");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1 text-left">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Reporting Center</h1>
          <p className="text-foreground/40 font-medium">Compliance-ready audit trails and analytics</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-white gap-2 flex-1 md:flex-none" onClick={() => generatePDF("New Executive Report")}>
            <FileText size={18} /> New Report
          </Button>
          <Button size="lg" variant="outline" className="rounded-full border-white/10 hover:bg-white/5 gap-2 flex-1 md:flex-none">
            <Send size={18} /> Distribute
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="glass-card border-none rounded-3xl p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={18} />
            <Input placeholder="Search reports by ID or Title..." className="pl-12 h-12 bg-white/5 border-none rounded-2xl" />
          </div>
          <Button variant="ghost" className="h-12 rounded-2xl px-6 hover:bg-white/5 font-bold uppercase text-[10px] tracking-widest text-foreground/40">Sort By Date</Button>
        </div>
      </Card>

      {/* Template Generator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { id: "REP-001", name: "Executive AI Audit", date: new Date().toLocaleDateString(), status: "Ready", size: "Dynamic" },
          { id: "REP-002", name: "Safety Violation Recap", date: new Date().toLocaleDateString(), status: "Ready", size: "Dynamic" },
        ].map((report) => (
          <motion.div
            key={report.id}
            whileHover={{ y: -4 }}
            className="group"
          >
            <Card className="glass-card border-none rounded-[2rem] p-8 relative overflow-hidden h-full">
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="space-y-2">
                  <Badge variant="outline" className="border-primary/20 text-primary text-[10px] font-black tracking-widest uppercase">
                    ID: {report.id}
                  </Badge>
                  <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">{report.name}</h3>
                </div>
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-foreground/40 group-hover:border-primary/50 group-hover:text-primary transition-all">
                  <FileText size={24} />
                </div>
              </div>

              <div className="flex items-center gap-6 mt-8 relative z-10">
                <div className="flex items-center gap-2 text-xs text-foreground/40">
                  <Clock size={14} /> {report.date}
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground/40">
                   <Download size={14} /> {report.size}
                </div>
                <div className="flex items-center gap-2 text-xs text-green-500 font-bold">
                  <CheckCircle2 size={14} /> {report.status}
                </div>
              </div>

              <div className="flex gap-3 mt-10 relative z-10">
                 <Button className="flex-1 rounded-2xl bg-white/5 hover:bg-primary hover:text-white transition-all gap-2" onClick={() => generatePDF(report.name)}>
                   <Download size={16} /> Download
                 </Button>
                 <Button variant="ghost" size="icon" className="rounded-2xl bg-white/5 hover:bg-white/10 text-foreground/40">
                   <ExternalLink size={18} />
                 </Button>
              </div>

              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Templates Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/40 px-4">Standard Templates</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {["Weekly Audit", "Risk Forecast", "Safety Board", "Incident Log"].map((t, i) => (
             <div key={i} className="p-6 rounded-3xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/30 transition-all cursor-pointer text-center group">
               <FileText size={32} className="mx-auto mb-4 text-foreground/20 group-hover:text-primary transition-colors" />
               <p className="font-bold text-sm">{t}</p>
             </div>
           ))}
        </div>
      </div>
    </motion.div>
  );
}
