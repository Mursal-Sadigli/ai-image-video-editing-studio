"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { motion } from "framer-motion";

export function FaqSection() {
  const faqs = [
    {
      q: "Kreditlər necə işləyir?",
      a: "Kreditlər platforma daxilindəki əməliyyatlarınız üçün istifadə etdiyiniz virtual valyutadır. Məsələn, 1 şəkil generasiyası 1 kredit, video isə daha çox kredit tələb edə bilər. Qeydiyyatdan keçdiyiniz an sizə pulsuz olaraq sınaq kreditləri verilir.",
    },
    {
      q: "Hansı ödəniş üsullarını qəbul edirsiniz?",
      a: "Biz bütün beynəlxalq debet və kredit kartlarını (Visa, MasterCard, Amex) dəstəkləyirik. Ödənişlər tam təhlükəsiz olaraq Stripe tərəfindən icra olunur.",
    },
    {
      q: "Yaratdığım şəkillərin müəllif hüququ kimə aiddir?",
      a: "Pro və Business planlarında yaratdığınız bütün vizuallar 100% sizin kommersiya mülkiyyətiniz sayılır və onlardan istədiyiniz məqsəd üçün istifadə edə bilərsiniz.",
    },
    {
      q: "Planımı istədiyim vaxt ləğv edə bilərəm?",
      a: "Bəli, heç bir illik öhdəlik yoxdur. Aylıq abunəliyinizi istədiyiniz an ləğv edə bilərsiniz. Həmin ayın sonuna qədər olan kreditləriniz isə aktiv qalacaq.",
    },
  ];

  return (
    <section className="w-full py-24 md:py-32 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Tez-tez Verilən Suallar</h2>
          <p className="text-muted-foreground text-lg">
            Sizi maraqlandıran digər suallara buradan cavab tapa bilərsiniz.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="bg-background rounded-3xl p-6 md:p-10 border shadow-sm"
        >
          <Accordion>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-lg font-medium hover:text-indigo-500 py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
