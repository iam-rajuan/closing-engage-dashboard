import { ShieldCheck, Landmark, FileText, CheckCircle2 } from "lucide-react";

export function DocumentMockPreview({ fileName }: { fileName: string }) {
  const name = fileName.toLowerCase();

  if (name.includes("wire_instructions")) {
    return (
      <div className="w-full h-full bg-[#fcfdfe] px-6 py-6 text-slate-800 flex flex-col justify-between font-mono text-[10px] leading-relaxed">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
            <div className="flex items-center gap-1.5">
              <Landmark size={14} className="text-slate-800" />
              <span className="font-bold tracking-tight text-[11px]">CHASE BANK, N.A.</span>
            </div>
            <div className="text-right text-[8px] text-slate-500 font-sans font-semibold">
              SECURE TRANSFER PROTOCOL V4.2
            </div>
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-[13px] font-bold text-slate-900 font-sans tracking-wide">
              WIRE TRANSFER ROUTING INSTRUCTIONS
            </h2>
            <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[8px] font-bold text-amber-700 border border-amber-200 font-sans uppercase">
              ⚠️ MUST VERIFY PHONE VOICE CONFIRMATION BEFORE WIRE
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 border border-slate-300 rounded overflow-hidden font-sans">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-300 font-bold text-[9px] text-slate-700">
              Escrow Account Beneficiary Information
            </div>
            <div className="divide-y divide-slate-200 text-[9px]">
              <div className="grid grid-cols-3 px-3 py-2">
                <span className="text-slate-500 font-medium">Receiving Bank:</span>
                <span className="col-span-2 font-bold text-slate-800">Chase Bank, N.A. (Austin, TX)</span>
              </div>
              <div className="grid grid-cols-3 px-3 py-2">
                <span className="text-slate-500 font-medium">ABA Routing #:</span>
                <span className="col-span-2 font-bold text-slate-800 font-mono">•••••4829 (Voice Call Mandatory)</span>
              </div>
              <div className="grid grid-cols-3 px-3 py-2">
                <span className="text-slate-500 font-medium">Account Number:</span>
                <span className="col-span-2 font-bold text-slate-800 font-mono">•••••••9012 (Voice Call Mandatory)</span>
              </div>
              <div className="grid grid-cols-3 px-3 py-2">
                <span className="text-slate-500 font-medium">Account Name:</span>
                <span className="col-span-2 font-bold text-slate-800">CLOSING ENGAGE TITLE & TRUST ESCROW</span>
              </div>
              <div className="grid grid-cols-3 px-3 py-2">
                <span className="text-slate-500 font-medium">Reference Code:</span>
                <span className="col-span-2 font-bold text-brand-600 font-mono">CE-TX-882190</span>
              </div>
            </div>
          </div>

          {/* Security details */}
          <div className="mt-5 rounded border border-slate-200 bg-slate-50/50 p-3 text-[8.5px] font-sans leading-normal text-slate-500">
            <div className="flex gap-2 items-start">
              <ShieldCheck size={12} className="text-brand-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-700">Multi-Factor Verification Required:</span> Wire fraud is a highly sophisticated risk. The Closing Engage platform mandates that all title buyers call their dedicated escrow officer to confirm bank routing data prior to dispatching funds. Do not reply to any bank instruction changes over email.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-3 text-center text-[7.5px] text-slate-400 font-sans">
          This system uses 256-bit bank-grade encryption. Page 1 of 1 · Confirmed
        </div>
      </div>
    );
  }

  if (name.includes("insurance_binder")) {
    return (
      <div className="w-full h-full bg-[#fbfcfd] px-6 py-6 text-slate-800 flex flex-col justify-between font-sans text-[9px] leading-relaxed">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
            <div>
              <span className="font-extrabold text-[12px] tracking-tight text-slate-900">STATE FARM</span>
              <div className="text-[6.5px] font-semibold tracking-wider text-slate-400 uppercase">FIRE AND CASUALTY COMPANY</div>
            </div>
            <div className="text-right text-[8px] font-bold text-slate-800">
              EVIDENCE OF PROPERTY INSURANCE
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-[8px]">
            <div className="border border-slate-200 rounded p-2 bg-slate-50/30">
              <div className="font-bold text-slate-400 uppercase text-[7px] mb-1">PRODUCER AGENCY</div>
              <div className="font-semibold text-slate-700">State Farm Central Agency</div>
              <div>102 South Congress Ave</div>
              <div>Austin, TX 78701</div>
            </div>
            <div className="border border-slate-200 rounded p-2 bg-slate-50/30">
              <div className="font-bold text-slate-400 uppercase text-[7px] mb-1">INSURED</div>
              <div className="font-semibold text-slate-700">Alex Mercer</div>
              <div>123 Maple St</div>
              <div>Austin, TX 78704</div>
            </div>
          </div>

          {/* Policy Info */}
          <div className="mt-4 border border-slate-300 rounded overflow-hidden">
            <div className="bg-slate-100 px-2 py-1.5 border-b border-slate-300 font-bold text-[8.5px] text-slate-700">
              Property Coverages &amp; Limits
            </div>
            <div className="divide-y divide-slate-200 text-[8px]">
              <div className="grid grid-cols-3 px-2 py-1.5">
                <span className="text-slate-500 font-medium">Policy Type:</span>
                <span className="col-span-2 font-bold text-slate-800">HO-3 Homeowners Coverage</span>
              </div>
              <div className="grid grid-cols-3 px-2 py-1.5">
                <span className="text-slate-500 font-medium">Policy Number:</span>
                <span className="col-span-2 font-bold text-slate-800 font-mono">9812-AO-9021-39</span>
              </div>
              <div className="grid grid-cols-3 px-2 py-1.5">
                <span className="text-slate-500 font-medium">Effective Date:</span>
                <span className="col-span-2 font-bold text-slate-800">10/24/2023 to 10/24/2024</span>
              </div>
              <div className="grid grid-cols-3 px-2 py-1.5">
                <span className="text-slate-500 font-medium">Dwelling Limit:</span>
                <span className="col-span-2 font-bold text-slate-800">$450,000.00</span>
              </div>
              <div className="grid grid-cols-3 px-2 py-1.5">
                <span className="text-slate-500 font-medium">Deductible:</span>
                <span className="col-span-2 font-bold text-slate-800">$1,000.00 (All perils)</span>
              </div>
            </div>
          </div>

          {/* Mortgagee */}
          <div className="mt-4 rounded border border-slate-200 p-2 bg-slate-50/50">
            <div className="font-bold text-slate-400 uppercase text-[7px] mb-1">ADDITIONAL INTEREST / MORTGAGEE</div>
            <div className="font-semibold text-slate-700">Apex Mortgage Group, ISAOA</div>
            <div>P.O. Box 90021, Dallas, TX 75201</div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-3 text-center text-[7.5px] text-slate-400">
          State Farm Binder Form SF-2023 · Authorized Signature Filed
        </div>
      </div>
    );
  }

  if (name.includes("title_search")) {
    return (
      <div className="w-full h-full bg-[#fafbfc] px-6 py-6 text-slate-800 flex flex-col justify-between font-sans text-[9px] leading-relaxed">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
            <span className="font-extrabold text-[12px] tracking-tight text-slate-900 uppercase">Fidelity National Title</span>
            <div className="text-right text-[8px] font-bold text-slate-500">
              PRELIMINARY TITLE REPORT
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-[8px] border-b border-slate-100 pb-1.5">
              <span className="text-slate-500 font-medium">Order Number:</span>
              <span className="font-bold text-slate-800 font-mono">FID-9821-CD</span>
            </div>
            <div className="flex justify-between text-[8px] border-b border-slate-100 pb-1.5">
              <span className="text-slate-500 font-medium">Effective Search Date:</span>
              <span className="font-bold text-slate-800">October 15, 2023 at 08:00 AM</span>
            </div>
            <div className="flex justify-between text-[8px] border-b border-slate-100 pb-1.5">
              <span className="text-slate-500 font-medium">Proposed Insured:</span>
              <span className="font-bold text-slate-850 font-semibold">Alex Mercer</span>
            </div>
          </div>

          <div className="mt-4 text-[8.5px] font-bold text-slate-700 uppercase tracking-wider">
            Schedule B - Requirements Checklist
          </div>
          <p className="mt-1 text-[8px] text-slate-500">
            The following requirements must be resolved prior to the execution of policy escrow:
          </p>

          <div className="mt-3 space-y-2">
            <div className="flex gap-2 items-start border border-line p-2 rounded bg-[#F8FAFD]">
              <CheckCircle2 size={11} className="text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-700">1. Property Tax Verification:</span> Tax liens for fiscal tax cycle 2022/2023 must be fully released and receipt of payment confirmed. (Status: <span className="text-emerald-600 font-bold">Resolved</span>)
              </div>
            </div>
            <div className="flex gap-2 items-start border border-line p-2 rounded bg-[#F8FAFD]">
              <CheckCircle2 size={11} className="text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-700">2. Release Prior Deed of Trust:</span> Document #2019-90218 must be fully satisfied and deed of reconveyance filed in Travis County. (Status: <span className="text-emerald-600 font-bold">Resolved</span>)
              </div>
            </div>
            <div className="flex gap-2 items-start border border-line p-2 rounded bg-amber-50/40 border-amber-200">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-700">3. Verification of Identity:</span> Executing seller must provide two valid forms of government identification to the signing notary. (Status: <span className="text-amber-600 font-bold">Pending Execution</span>)
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-3 text-center text-[7.5px] text-slate-400">
          Fidelity National Title Insurance Company · Commitment Form 2023-A
        </div>
      </div>
    );
  }

  if (name.includes("seller_net")) {
    return (
      <div className="w-full h-full bg-[#fdfdfd] px-6 py-6 text-slate-800 flex flex-col justify-between font-sans text-[9px] leading-relaxed">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
            <span className="font-bold text-[12px] tracking-tight text-slate-900">CLOSING ENGAGE</span>
            <span className="text-right text-[8px] font-bold text-slate-500 uppercase tracking-widest">
              Estimated Seller Net Sheet
            </span>
          </div>

          <div className="mt-4 bg-slate-50 p-2.5 rounded border border-slate-200 text-[8px]">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-slate-400 font-semibold">Seller:</span> Jane Doe</div>
              <div><span className="text-slate-400 font-semibold">Date:</span> Oct 24, 2023</div>
              <div className="col-span-2"><span className="text-slate-400 font-semibold">Address:</span> 123 Maple St, Austin, TX</div>
            </div>
          </div>

          <div className="mt-4 text-[8.5px] font-bold text-slate-800 uppercase tracking-wider mb-2">
            Net Proceed Calculations
          </div>

          <div className="border border-slate-350 border-slate-300 rounded overflow-hidden">
            <div className="divide-y divide-slate-200 text-[8px]">
              <div className="grid grid-cols-3 px-2.5 py-2 bg-emerald-50/20">
                <span className="col-span-2 font-semibold text-slate-700">Gross Sales Price</span>
                <span className="text-right font-extrabold text-slate-900">$550,000.00</span>
              </div>
              <div className="grid grid-cols-3 px-2.5 py-1.5">
                <span className="col-span-2 text-slate-500">Less Mortage Payoff</span>
                <span className="text-right font-bold text-slate-800">-$320,000.00</span>
              </div>
              <div className="grid grid-cols-3 px-2.5 py-1.5">
                <span className="col-span-2 text-slate-500">Broker Commissions (6.0%)</span>
                <span className="text-right font-bold text-slate-800">-$33,000.00</span>
              </div>
              <div className="grid grid-cols-3 px-2.5 py-1.5">
                <span className="col-span-2 text-slate-500">Escrow &amp; Settlement Fee</span>
                <span className="text-right font-bold text-slate-800">-$1,250.00</span>
              </div>
              <div className="grid grid-cols-3 px-2.5 py-1.5">
                <span className="col-span-2 text-slate-500">Title Insurance Premium</span>
                <span className="text-right font-bold text-slate-800">-$2,850.00</span>
              </div>
              <div className="grid grid-cols-3 px-2.5 py-2 bg-[#EEF5FF]">
                <span className="col-span-2 font-bold text-brand-700">Estimated Net Proceeds</span>
                <span className="text-right font-black text-brand-600">$192,900.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-3 text-center text-[7.5px] text-slate-400 font-mono">
          ESTIMATE ONLY · ALL FIGURES SUBJECT TO ESCROW AUDIT
        </div>
      </div>
    );
  }

  if (name.includes("buyer_statement")) {
    return (
      <div className="w-full h-full bg-[#fdfdfd] px-6 py-6 text-slate-800 flex flex-col justify-between font-sans text-[9px] leading-relaxed">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
            <span className="font-bold text-[12px] tracking-tight text-slate-900">CLOSING ENGAGE</span>
            <span className="text-right text-[8px] font-bold text-slate-500 uppercase tracking-widest">
              Buyer Settlement Statement
            </span>
          </div>

          <div className="mt-4 bg-slate-50 p-2.5 rounded border border-slate-200 text-[8px]">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-slate-400 font-semibold">Buyer:</span> Alex Mercer</div>
              <div><span className="text-slate-400 font-semibold">Escrow #:</span> CE-TX-882190</div>
              <div className="col-span-2"><span className="text-slate-400 font-semibold">Property Address:</span> 123 Maple St, Austin, TX</div>
            </div>
          </div>

          <div className="mt-4 text-[8.5px] font-bold text-slate-850 uppercase tracking-wider mb-2">
            Ledger Debits &amp; Credits
          </div>

          <div className="border border-slate-300 rounded overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-50 px-2.5 py-1.5 font-bold text-[7.5px] text-slate-600 border-b border-slate-300">
              <span>Item Description</span>
              <span className="text-right">Debit (Charge)</span>
              <span className="text-right">Credit (Payment)</span>
            </div>
            <div className="divide-y divide-slate-200 text-[8px]">
              <div className="grid grid-cols-3 px-2.5 py-1.5">
                <span className="font-medium text-slate-700">Contract Purchase Price</span>
                <span className="text-right font-bold text-slate-800">$425,000.00</span>
                <span className="text-right text-slate-300">-</span>
              </div>
              <div className="grid grid-cols-3 px-2.5 py-1.5">
                <span className="font-medium text-slate-700">Earnest Money Deposit</span>
                <span className="text-right text-slate-300">-</span>
                <span className="text-right font-bold text-slate-800">-$10,000.00</span>
              </div>
              <div className="grid grid-cols-3 px-2.5 py-1.5">
                <span className="font-medium text-slate-700">New First Loan (Apex)</span>
                <span className="text-right text-slate-300">-</span>
                <span className="text-right font-bold text-slate-800">-$340,000.00</span>
              </div>
              <div className="grid grid-cols-3 px-2.5 py-1.5">
                <span className="font-medium text-slate-700">Apex Loan Fees</span>
                <span className="text-right font-bold text-slate-800">$3,850.00</span>
                <span className="text-right text-slate-300">-</span>
              </div>
              <div className="grid grid-cols-3 px-2.5 py-1.5">
                <span className="font-medium text-slate-700">Escrow &amp; Recording Fees</span>
                <span className="text-right font-bold text-slate-800">$1,150.00</span>
                <span className="text-right text-slate-300">-</span>
              </div>
              <div className="grid grid-cols-3 px-2.5 py-2 bg-[#EEF5FF]">
                <span className="font-bold text-brand-700">Balance Cash Due From Buyer</span>
                <span className="text-right text-slate-300">-</span>
                <span className="text-right font-black text-brand-600">-$80,000.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-3 text-center text-[7.5px] text-slate-400 font-mono">
          OFFICIAL SETTLEMENT LEDGER · FINAL SIGN-OFF COMPLETED
        </div>
      </div>
    );
  }

  // Notary signing act, scanback documents, or any other fallback document
  return (
    <div className="w-full h-full bg-[#fdfdfd] px-6 py-6 text-slate-800 flex flex-col justify-between font-serif text-[9px] leading-relaxed border-2 border-double border-slate-800">
      <div>
        {/* Header */}
        <div className="flex flex-col items-center border-b border-slate-800 pb-3 font-sans">
          <span className="font-extrabold text-[12px] tracking-tight uppercase text-slate-900">Closing Engage Document Suite</span>
          <span className="text-[7.5px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5">Official Transaction Sandbox Record</span>
        </div>

        <div className="mt-5 text-center font-sans">
          <h2 className="text-[12px] font-bold text-slate-950 uppercase tracking-wide">
            {fileName.replace(".pdf", "").replace(/_/g, " ")}
          </h2>
          <span className="mt-1 text-[8px] font-bold text-brand-500 uppercase font-mono">
            Transaction Ref: CE-TX-882190
          </span>
        </div>

        <div className="mt-6 text-[8.5px] text-justify space-y-4">
          <p className="first-letter:text-[14px] first-letter:font-bold first-letter:font-sans">
            This document represents a legally verified electronic copy of the official file uploaded within the Closing Engage closing transaction pipeline. The transaction contains escrow provisions, mortgage notes, title clearances, and mutual signature covenants.
          </p>
          <p>
            It is hereby certified that the original copy of this digital file resides in the Closing Engage tamper-evident audit ledger under security cryptographic signature block <span className="font-mono text-slate-500">#SHA256-4A9B8F</span>.
          </p>
        </div>

        {/* Stamp & Seal section */}
        <div className="mt-8 grid grid-cols-2 gap-4 font-sans">
          <div className="border border-dashed border-slate-400 p-2.5 rounded flex flex-col items-center justify-center min-h-[72px] bg-slate-50/50">
            <span className="text-[7px] font-extrabold text-slate-400 tracking-widest uppercase mb-1">OFFICIAL SEAL</span>
            <div className="text-center text-[7px] leading-tight text-slate-500">
              <div>NOTARY PUBLIC</div>
              <div>STATE OF TEXAS</div>
              <div>COMM. EXP. 12/31/2026</div>
            </div>
          </div>
          <div className="border border-dashed border-slate-400 p-2.5 rounded flex flex-col items-end justify-between min-h-[72px] bg-slate-50/50">
            <span className="text-[7px] font-extrabold text-slate-400 tracking-widest uppercase self-center">SIGNATURE</span>
            <div className="text-[8px] italic font-serif text-slate-700 pr-2">Jane Simmons, Notary</div>
            <div className="w-full h-px bg-slate-300 mt-1" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 pt-3 text-center text-[7.5px] text-slate-400 font-sans">
        Security Authenticated By Closing Engage Platform · Page 1 of 1
      </div>
    </div>
  );
}
