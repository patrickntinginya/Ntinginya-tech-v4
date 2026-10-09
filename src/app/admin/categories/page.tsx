import { deleteCategoryAction, updateCategoryAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { CategoryCreateForm } from "@/components/admin/SimpleForms";
import { Card, Empty, Notice, PageHeader, btnDanger, btnDark, inputClass, labelClass } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { listAdminCategories } from "@/lib/cms/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categories" };

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  await requireStaff();
  const { notice } = await searchParams;
  const categories = await listAdminCategories();

  return (
    <>
      <PageHeader title="Categories" description="Organise articles. A category that posts still use can only be deleted after moving those posts." />
      <Notice code={notice} />
      <div className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <Card className="h-fit">
          <h2 className="mb-4 font-sans text-xl font-semibold">New category</h2>
          <CategoryCreateForm />
        </Card>

        <div className="space-y-3">
          {categories.length === 0 ? <Empty>No categories yet.</Empty> : null}
          {categories.map((c) => {
            const others = categories.filter((o) => o.id !== c.id);
            return (
              <details key={c.id} className="rounded-xl border border-deep/15 bg-paper">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                  <span className="min-w-0">
                    <span className="block truncate font-sans font-semibold">{c.name}</span>
                    <span className="block truncate font-sans text-xs text-deep/70">/{c.slug} · {c.post_count} post{c.post_count === 1 ? "" : "s"}</span>
                  </span>
                  <span className="font-sans text-sm font-semibold underline underline-offset-4">Edit</span>
                </summary>
                <div className="space-y-6 border-t border-deep/10 p-4">
                  <form action={updateCategoryAction} className="space-y-4">
                    <input type="hidden" name="id" value={c.id} />
                    <div>
                      <label htmlFor={`n-${c.id}`} className={labelClass}>Name</label>
                      <input id={`n-${c.id}`} name="name" defaultValue={c.name} required maxLength={80} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor={`s-${c.id}`} className={labelClass}>Slug</label>
                      <input id={`s-${c.id}`} name="slug" defaultValue={c.slug} maxLength={80} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor={`d-${c.id}`} className={labelClass}>Description</label>
                      <input id={`d-${c.id}`} name="description" defaultValue={c.description ?? ""} maxLength={200} className={inputClass} />
                    </div>
                    <button type="submit" className={btnDark}>Save category</button>
                  </form>

                  <form action={deleteCategoryAction} className="space-y-3 border-t border-deep/10 pt-4">
                    <input type="hidden" name="id" value={c.id} />
                    {c.post_count > 0 ? (
                      <div>
                        <label htmlFor={`r-${c.id}`} className={labelClass}>
                          Move its {c.post_count} post{c.post_count === 1 ? "" : "s"} to
                        </label>
                        <select id={`r-${c.id}`} name="reassign_to" defaultValue="" required className={inputClass}>
                          <option value="" disabled>Choose a category</option>
                          <option value="none">No category</option>
                          {others.map((o) => (
                            <option key={o.id} value={o.id}>{o.name}</option>
                          ))}
                        </select>
                      </div>
                    ) : null}
                    <ConfirmButton confirm={`Delete the category "${c.name}"?`} className={btnDanger}>
                      Delete category
                    </ConfirmButton>
                  </form>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </>
  );
}
