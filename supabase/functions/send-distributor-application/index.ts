import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DistributorApplicationRequest {
  fullName: string;
  email: string;
  phone?: string;
  portfolioUrl?: string;
  distributionPlan: string;
  targetFilms: string;
  targetCustomers: number;
  timelineMonths: number;
  experience?: string;
  socialMediaLinks?: string;
  additionalInfo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: DistributorApplicationRequest = await req.json();

    const emailHtml = `
      <h1>New Distributor Application</h1>
      
      <h2>Applicant Information</h2>
      <ul>
        <li><strong>Name:</strong> ${data.fullName}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Phone:</strong> ${data.phone || "Not provided"}</li>
        <li><strong>Portfolio:</strong> ${data.portfolioUrl || "Not provided"}</li>
      </ul>
      
      <h2>Distribution Plan</h2>
      <ul>
        <li><strong>Target Films:</strong> ${data.targetFilms}</li>
        <li><strong>Target Customers:</strong> ${data.targetCustomers}</li>
        <li><strong>Timeline:</strong> ${data.timelineMonths} months</li>
      </ul>
      
      <h3>Distribution Strategy</h3>
      <p>${data.distributionPlan}</p>
      
      <h2>Experience & Background</h2>
      <p>${data.experience || "Not provided"}</p>
      
      <h3>Social Media Links</h3>
      <p>${data.socialMediaLinks || "Not provided"}</p>
      
      <h3>Additional Information</h3>
      <p>${data.additionalInfo || "Not provided"}</p>
      
      <hr>
      <p><em>This application was submitted via Quiflix.me</em></p>
    `;

    const emailResponse = await resend.emails.send({
      from: "Quiflix <onboarding@resend.dev>",
      to: ["Quiflix.me@proton.me"],
      subject: `New Distributor Application: ${data.fullName}`,
      html: emailHtml,
      reply_to: data.email,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-distributor-application function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
